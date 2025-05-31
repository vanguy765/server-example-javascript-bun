import { Hono } from "hono";
import { envConfig } from "../config/env.config";
import { Bindings } from "../types/hono.types";
import { z } from "zod";
import type { Database } from "../supabase/generated.types";
import { tenantsRowSchema } from "../supabase/generated.schemas";
import { createRepository } from "../supabase/generated-repo";
import { supabaseClient } from "../supabase/client";
//import { promises as fs } from "fs";

import * as fs from "fs";

const path = require("path");

type TenantRow = z.output<typeof tenantsRowSchema>;

const app = new Hono<{ Bindings: Bindings }>();

const customer_id = "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a";

const agent: {
  prompt?: string;
  tool?: any;
  xmlCustomer?: string;
  xmlCompany?: string;
  xmlProposedOrder?: string;
  xmlProductSpecials?: string;
  xmlFavoriteProducts?: string;
} = {};

interface CustomerLastOrder {
  id: string;
  order_date: string;
  status: string;
  total_amount: number;
  lineItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      description: string;
      size: string;
    };
  }>;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  company: {
    id: string;
    name: string;
    domain: string;
  };
}

interface ProposedOrder {
  id: string;
  order_date: string;
  status: string;
  lineItems: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      description: string;
      size: string;
      price: number;
    };
  }>;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  company: {
    id: string;
    name: string;
    domain: string;
  };
}

interface RelationshipOption {
  table: string;
  columns?: string[];
  jsonKey?: string;
}

interface SortingOption {
  column: string;
  direction?: string;
}

interface BuildDynamicQueryOptions {
  columns?: string[];
  filters?: Filter[];
  relationships?: (string | RelationshipOption)[];
  jsonKey?: string | null;
  sorting?: SortingOption[];
  limit?: number | null;
  single?: boolean;
}

interface BuildDynamicQueryResponse<T = any> {
  data: T | null;
  error: any;
}

type Filter = {
  column: string;
  operator: string;
  value: any;
};

const buildDynamicQuery = async <
  TName extends keyof Database["public"]["Tables"],
  TResponseData = any
>(
  tableName: TName,
  options: BuildDynamicQueryOptions = {}
): Promise<BuildDynamicQueryResponse<TResponseData>> => {
  const {
    columns = ["*"],
    filters = [],
    relationships = [],
    jsonKey = null,
    sorting = [],
    limit = null,
    single = false,
  } = options;

  const columnsString = columns.join(", ");
  let selectString = columnsString;

  if (relationships.length > 0) {
    const relationshipStrings = relationships.map((rel) => {
      if (typeof rel === "string") {
        return `${rel}(*)`;
      } else {
        const { table, columns: relColumns = ["*"], jsonKey: relJsonKey } = rel;
        if (relJsonKey) {
          return `${relJsonKey}:${table}(${relColumns.join(", ")})`;
        } else {
          return `${table}(${relColumns.join(", ")})`;
        }
      }
    });
    selectString = [columnsString, ...relationshipStrings].join(", ");
  }

  let finalSelectString = jsonKey ? `${jsonKey}:${selectString}` : selectString;

  // The select method here types the individual row shape as TResponseData
  let query = supabaseClient
    .from(tableName)
    .select<string, TResponseData>(finalSelectString);

  if (filters.length > 0) {
    filters.forEach((filter) => {
      const { column, operator, value } = filter;
      if ((query as any)[operator]) {
        query = (query as any)[operator](column, value);
      }
    });
  }

  if (sorting.length > 0) {
    sorting.forEach((sort) => {
      const { column, direction = "asc" } = sort;
      query = query.order(column as string, {
        ascending: direction.toLowerCase() === "asc",
      });
    });
  }

  if (single) {
    // .maybeSingle() on a query typed with TResponseData row shape
    // should return { data: TResponseData | null, error: PostgrestError | null }
    const { data, error } = await query.maybeSingle();
    return { data, error };
  }

  if (limit !== null) {
    query = query.limit(limit);
  }

  // Awaiting the query directly (without .maybeSingle())
  // should return { data: TResponseData[], error: PostgrestError | null }
  const { data, error } = await query;

  // If limit is 1, and data is an array, extract the first element.
  // This assumes TResponseData is the type of a single item, not an array.
  if (Array.isArray(data) && limit === 1) {
    if (data.length > 0) {
      return { data: data[0] as TResponseData, error };
    } else {
      return { data: null, error: error || { message: "No records found" } };
    }
  }

  // If TResponseData is meant to be an array (e.g. TResponseData = SomeItem[]),
  // then this cast is fine. If TResponseData is a single item type (e.g. SomeItem),
  // and 'data' is SomeItem[], this cast is problematic.
  // Given the call for customerLastOrder expects a single object, the limit:1 case above handles it.
  // For other uses, the caller must ensure TResponseData matches the actual data structure (array or single).
  return { data: data as TResponseData | null, error }; // This might need to be TResponseData[] if TResponseData is not an array type
};

app.post("/", async (c) => {
  const { phoneNumberId, assistantId, customerNumber } =
    await c.req.json<any>();

  console.log(
    `reorderbot_originalAdjusted: Received request to place outbound call with 
    phoneNumberId: ${phoneNumberId}, 
    assistantId: ${assistantId}, 
    customerNumber: ${customerNumber}`
  );

  let tenants: TenantRow[] | undefined;

  let proposedOrder_temp: BuildDynamicQueryResponse<ProposedOrder> | undefined;
  try {
    const tenantsRepository = createRepository("tenants");
    const fetchedTenantsFromRepo = await tenantsRepository.getAll();
    if (fetchedTenantsFromRepo) {
      tenants = fetchedTenantsFromRepo as TenantRow[];
    } else {
      tenants = [];
    }

    console.log(
      "Successfully retrieved tenants using dynamic repository:",
      tenants
    );

    proposedOrder_temp = await buildDynamicQuery<"orders", ProposedOrder>(
      "orders",
      {
        columns: ["id", "order_date", "status"],
        filters: [
          {
            column: "customer_id",
            operator: "eq",
            value: customer_id,
          },
        ],
        relationships: [
          {
            table: "order_items",
            columns: [
              "id",
              "quantity",
              "product:product_id(id, name, description, size, price)",
            ],
            jsonKey: "lineItems",
          },
          {
            table: "customers",
            columns: ["id", "first_name", "last_name", "phone"],
            jsonKey: "customer",
          },
          {
            table: "tenants",
            columns: ["id", "name", "domain"],
            jsonKey: "company",
          },
        ],
        jsonKey: "proposed_order",
        sorting: [{ column: "order_date", direction: "desc" }],
        limit: 1,
      }
    );
  } catch (error) {
    console.error("Failed to retrieve tenants or customer last order:", error);
    tenants = undefined;
    proposedOrder_temp = undefined;
  }

  console.log(
    `reorderbot_originalAdjusted: proposedOrder:`,
    proposedOrder_temp
  );

  const proposedOrder = proposedOrder_temp;

  if (proposedOrder?.data) {
    const orderData = proposedOrder.data;

    // Calculate lineTotal for each line item
    let subTotal = 0;
    if (orderData.lineItems) {
      orderData.lineItems.forEach((item) => {
        const lineTotal = item.product.price * item.quantity;
        item.lineTotal = Number(lineTotal.toFixed(2));
        subTotal += lineTotal;
      });
    }

    // Round subtotal to 2 decimal places
    subTotal = Number(subTotal.toFixed(2));

    // Calculate tax amounts
    const GST = Number((subTotal * 0.07).toFixed(2));
    const PST = Number((subTotal * 0.06).toFixed(2));
    const total = Number((subTotal + GST + PST).toFixed(2));

    // Add financial totals to the order data
    let formattedProposedOrder = {
      ...orderData,
      subTotal,
      GST,
      PST,
      total,
    };

    //=====================================================

    // Extract customer and company objects
    let customer = null;
    let company = null;

    // Extract company
    if (formattedProposedOrder?.company) {
      const { customer: extractedCustomer, ...restData } =
        formattedProposedOrder;
      customer = { ...extractedCustomer };
      formattedProposedOrder = restData;
    }
    // Format the object as a readable JSON string with 2-space indentation
    const formattedCustomerJson = JSON.stringify(customer, null, 2);
    const xmlCustomer = `
<customer_information>
      ${formattedCustomerJson}
</customer_information>`;
    console.log("\nExtracted customer:", xmlCustomer);

    agent.xmlCustomer = xmlCustomer;
    //================

    // Extract company
    if (formattedProposedOrder?.company) {
      const { company: extractedCompany, ...restData } = formattedProposedOrder;
      company = { ...extractedCompany };
      formattedProposedOrder = restData;
    }
    // Format the object as a readable JSON string with 2-space indentation
    const formattedCompanyJson = JSON.stringify(company, null, 2);
    const xmlCompany = `
<company_information>
      ${formattedCompanyJson}
</company_information>`;
    console.log("\nExtracted company:", xmlCompany);

    agent.xmlCompany = xmlCompany;
    //================

    // Format the object as a readable JSON string with 2-space indentation
    const formattedProposedOrderJson = JSON.stringify(
      formattedProposedOrder,
      null,
      2
    );
    const xmlProposedOrder = `
<pending_order_details>
      ${formattedProposedOrderJson}
</pending_order_details>`;
    console.log("\nProposed Order:", xmlProposedOrder);

    // console.log(
    //   `reorderbot_originalAdjusted: formattedProposedOrder:`,
    //   formattedProposedOrder
    // );

    agent.xmlProposedOrder = xmlProposedOrder;
  }
  //==========================================================
  // Get all valid products from product_specials with complete details
  // Define an interface for your product specials
  interface ProductSpecial {
    product_id: string;
    name: string;
    description: string;
    price: number;
    size: string;
    discount: number;
    end_date: string;
  }

  // Then use the interface with the function
  const validProductSpecials = await buildDynamicQuery<
    "product_specials_view",
    ProductSpecial[]
  >("product_specials_view", {
    columns: [
      "id:product_id",
      "name:product_name",
      "description:product_description",
      "price:product_price",
      "size:product_size",
      "discount",
      "end_date",
    ],
    filters: [
      {
        column: "end_date",
        operator: "gte",
        value: new Date().toISOString(),
      },
      {
        column: "tenant_id",
        operator: "eq",
        value: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
      },
    ],
    sorting: [{ column: "discount", direction: "desc" }],
  });

  // Process the valid product specials to add regular_price and calculate discounted price
  if (validProductSpecials?.data) {
    // Map through each product special and transform the price fields
    validProductSpecials.data = validProductSpecials.data.map((product) => {
      // Store the original price as regular_price
      const regular_price = product.price;

      // Calculate discounted price (apply discount percentage)
      const discountAmount = (product.discount / 100) * regular_price;
      const discounted_price = Number(
        (regular_price - discountAmount).toFixed(2)
      );

      // Return transformed product with both prices
      return {
        ...product,
        regular_price: regular_price,
        price: discounted_price, // Override original price with discounted price
      };
    });
    let formattedProductSpecials =
      validProductSpecials.data as ProductSpecial[];

    // Format the object as a readable JSON string with 2-space indentation
    const formattedProductSpecialsJson = JSON.stringify(
      formattedProductSpecials,
      null,
      2
    );
    const xmlProductSpecials = `
<current_promotional_offers>
      ${formattedProductSpecialsJson}
</current_promotional_offers>`;
    console.log("\nPromotional Offers:", xmlProductSpecials);

    //console.log("Transformed product specials:", formattedProductSpecials);

    agent.xmlProductSpecials = xmlProductSpecials;
  }

  //=========================================================
  // Get product details for all products listed in customer_preferences.favorites
  // First, get the customer preferences with favorites
  const customerPreferences = await buildDynamicQuery("customer_preferences", {
    columns: ["id", "customer_id", "favorites"],
    filters: [
      {
        column: "customer_id",
        operator: "eq",
        value: customer_id,
      },
      {
        column: "favorites",
        operator: "not.is",
        value: null,
      },
    ],
    single: true,
  });

  console.log("Customer preferences:", customerPreferences);

  // Extract favorite product IDs from preferences
  let favoriteProductIds: string[] = [];
  if (
    customerPreferences.data &&
    customerPreferences.data.favorites &&
    customerPreferences.data.favorites.order_items
  ) {
    // Favorites is an object with order_items array
    favoriteProductIds = Array.isArray(
      customerPreferences.data.favorites.order_items
    )
      ? customerPreferences.data.favorites.order_items
      : [];
  }

  // If we have favorite product IDs, fetch the product details
  let favoriteProducts = null;
  if (favoriteProductIds.length > 0) {
    favoriteProducts = await buildDynamicQuery("products", {
      columns: ["id", "name", "description", "size", "price"],
      filters: [
        {
          column: "id",
          operator: "in",
          value: favoriteProductIds,
        },
      ],
    });

    // Format the object as a readable JSON string with 2-space indentation
    const formattedFavoriteProductsJson = JSON.stringify(
      favoriteProducts,
      null,
      2
    );
    const xmlFavoriteProducts = `
<customer_favorite_items>
      ${formattedFavoriteProductsJson}
</customer_favorite_items>`;
    console.log("\nCustomer Favorite Items:", xmlFavoriteProducts);

    agent.xmlFavoriteProducts = xmlFavoriteProducts;
  }

  // ========================================================

  // Get the tools
  const tool_sendOrderPackageBySms = {
    function: {
      name: "sendOrderPackageBySms",
      description:
        "Sends an initial package of information (Proposed Order based on last order, Special Products, Favorite Products) to the customer's phone via SMS. The data is retrieved from the database using the callId.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
    type: "function",
  };

  // ========================================================

  const tool_sendSmsOrderUpdate = {
    function: {
      name: "sendSmsOrderUpdate",
      description:
        "Send an updated order summary via SMS to the customer after any order modifications",
      parameters: {
        type: "object",
        properties: {
          customerPhone: {
            type: "string",
            description:
              "Customer's phone number in E.164 format (e.g., +12175553456)",
          },
          customerName: {
            type: "string",
            description: "Customer's full name",
          },
          companyName: {
            type: "string",
            description: "Customer's company name",
          },
          orderItems: {
            type: "array",
            description: "Array of order line items",
            items: {
              type: "object",
              properties: {
                productName: {
                  type: "string",
                  description: "Name of the product",
                },
                size: {
                  type: "string",
                  description: "Product size/packaging",
                },
                quantity: {
                  type: "integer",
                  description: "Quantity ordered",
                },
                unitPrice: {
                  type: "number",
                  description: "Price per unit",
                },
                lineTotal: {
                  type: "number",
                  description:
                    "Total for this line item (quantity × unitPrice)",
                },
              },
              required: [
                "productName",
                "size",
                "quantity",
                "unitPrice",
                "lineTotal",
              ],
            },
          },
          subtotal: {
            type: "number",
            description: "Order subtotal before taxes",
          },
          gst: {
            type: "number",
            description: "GST tax amount",
          },
          pst: {
            type: "number",
            description: "PST tax amount",
          },
          total: {
            type: "number",
            description: "Final total including all taxes",
          },
        },
        required: [
          "customerPhone",
          "customerName",
          "companyName",
          "orderItems",
          "subtotal",
          "gst",
          "pst",
          "total",
        ],
      },
    },
    type: "function",
  };

  agent.tool = tool_sendOrderPackageBySms;
  // agent.tool = [];

  // =================================================================
  // Create the prompt template for the voice assistant
  // =================================================================

  // Get the agent
  const agentFilePath =
    "C:\\Users\\3900X\\Code\\vapiordie3\\vapiordie3\\src\\assistants\\domain\\acmecleaning.com\\reorderbot\\agent_reorderbot_gemini.md";

  // Function to read prompt template from file and insert agent values
  function buildPromptFromFile(templateFilePath, agent) {
    try {
      // Read the template file
      const promptTemplate = fs.readFileSync(templateFilePath, "utf8");

      // Replace template variables with actual values using a template literal function

      const interpolate = (template, variables) => {
        // Create a safe copy of the variables to prevent template literal execution issues
        const safeVariables = {};

        // Stringify and re-parse any complex objects to remove functions/methods
        for (const key in variables) {
          if (typeof variables[key] === "object" && variables[key] !== null) {
            safeVariables[key] = JSON.parse(JSON.stringify(variables[key]));
          } else {
            safeVariables[key] = variables[key];
          }
        }

        // Escape any backtick characters in the template
        const escapedTemplate = template.replace(/`/g, "\\`");

        // Return a function that executes the template with the safe variables
        try {
          return new Function(
            ...Object.keys(safeVariables),
            `return \`${escapedTemplate}\`;`
          )(...Object.values(safeVariables));
        } catch (error) {
          console.error("Error in template interpolation:", error);
          return template; // Return original template if interpolation fails
        }
      };

      // Build the prompt by replacing template variables
      const builtPrompt = interpolate(promptTemplate, {
        agent: agent,
      });

      return builtPrompt;
    } catch (error) {
      console.error(`Error building prompt from template: ${error.message}`);
      throw error;
    }
  }

  // Usage example
  try {
    // const templatePath = path.join(__dirname, 'order-management-template.txt');
    const templatePath = agentFilePath;
    agent.prompt = buildPromptFromFile(templatePath, agent);
    console.log("Prompt built successfully");
    //console.log("Agent prompt:", agent.prompt);
  } catch (error) {
    console.error("Failed to build prompt:", error);
  }

  console.log("DONE Agent prompt:", agent.prompt);

  // =================================================================
  // Create the voice assistant
  // =================================================================

  const assistant = {
    transcriber: {
      provider: "deepgram",
      keywords: ["Bicky:1"],
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "REPLACE THIS WITH THE AGENT PROMPT",
        },
      ],
      tools: ["REPLACE THIS WITH agent.tool"],
    },
    voice: {
      provider: "openai",
      voiceId: "onyx",
    },
    voicemailMessage:
      "Hi, this is Jennifer from Bicky Realty. We were just calling to let you know...",
    firstMessage:
      "Hello, this is Alex, your AI sales assistant from Acme Cleaning Supply Inc.",
    endCallMessage: "Thanks for your time.",
    endCallFunctionEnabled: true,
    recordingEnabled: false,
    server: { url: "https://0489-24-86-56-54.ngrok-free.app/api/webhook" },
  };

  assistant.model.messages[0].content = agent.prompt ?? "";
  assistant.model.tools = [agent.tool];
  // assistant.model.tools = [];

  console.log(
    "================================================================"
  );
  console.log("assistant:", assistant);
  console.log(
    "================================================================"
  );

  // console.log("process.exit(0);");
  // process.exit(0);

  try {
    const response = await fetch(`${envConfig.vapi.baseUrl}/call/phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envConfig.vapi.apiKey}`,
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        assistant: assistant,
        customer: {
          number: customerNumber,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response
        .text()
        .catch(() => "Could not read error body");
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    const data = await response.json();

    console.log(
      "=================================================================================="
    );
    console.log("VAPI call successful:", data.id);
    // Save to db by key callId

    // use buildDynamicQuery

    return c.json(data, 200);

    // const returnResults = {
    //   results: [
    //     {
    //       toolCallId: "X",
    //       result: `Copies of what the customer was sent by SMS. ${agent.xmlProposedOrder} ${agent.xmlProductSpecials} ${agent.xmlFavoriteProducts}`,
    //     },
    //   ],
    // };

    // return c.json(returnResults, 200);
    // const data = {agent.xmlProposedOrder, agent.xmlProductSpecials, agent.xmlFavoriteProducts}
  } catch (error) {
    console.error("VAPI call failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during VAPI call";
    return c.json(
      {
        message: "Failed to place outbound call",
        error: errorMessage,
      },
      500
    );
  }
});

export { app as reorderbotRoute };

// {
//   "message": "Failed to place outbound call",
//   "error": "HTTP error! status: 400, body: {\"message\":[\"assistant.model.each value in tools.type must be one of the following values: dtmf, endCall, transferCall, output, voicemail, query, sms, function, mcp, apiRequest, bash, computer, textEditor, google.calendar.event.create, google.calendar.availability.check, google.sheets.row.append, slack.message.send, gohighlevel.calendar.event.create, gohighlevel.calendar.availability.check, gohighlevel.contact.create, gohighlevel.contact.get, make, ghl\"],\"error\":\"Bad Request\",\"statusCode\":400}"
// }
