import { Hono } from "hono";
import { envConfig } from "../config/env.config";
import { Bindings } from "../types/hono.types";
import { z } from "zod";
import type { Database } from "../supabase/generated.types";
import { tenantsRowSchema } from "../supabase/generated.schemas";
import { createRepository } from "../supabase/generated-repo";
import { supabaseClient } from "../supabase/client";
import { promises as fs } from "fs";

const path = require("path");

type TenantRow = z.output<typeof tenantsRowSchema>;

const app = new Hono<{ Bindings: Bindings }>();

const customer_id = "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a";

const agent = {};

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

  // Result of the query will be an object with proposed order details
  // Example output:
  // reorderbot_originalAdjusted: proposedOrder: {
  //   data: {
  //     proposed_order: "2950963c-7f41-4739-8296-9ee0e0f0a6bd",
  //     order_date: "2025-05-19T05:47:46.28778+00:00",
  //     status: "confirmed",
  //     lineItems: [
  //       {
  //         id: "c832c2be-f827-4e86-b249-7b0559d1a4c4",
  //         product: {
  //           id: "5c6d7e8f-9a0b-4f9b-d3e4-f5a6b7c8d9e0",
  //           name: "Disinfectant Wipes",
  //           size: "160 count",
  //           price: 12.99,
  //           description: "Pre-moistened disinfectant wipes for quick surface disinfection",
  //         },
  //         quantity: 4,
  //       }, {
  //         id: "2ab94983-72f8-4a33-9d1b-92d09a330ce8",
  //         product: {
  //           id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
  //           name: "Hand Sanitizer Gel",
  //           size: "1 Gallon",
  //           price: 29.99,
  //           description: "70% alcohol-based hand sanitizer gel with pump",
  //         },
  //         quantity: 2,
  //       }, {
  //         id: "5797f2e5-5c37-4a66-8010-dfabf99dcc25",
  //         product: {
  //           id: "0d1e2f3a-4b5c-4a46-8f9a-0b1c2d3e4f5a",
  //           name: "Heavy-Duty Chemical Resistant Gloves",
  //           size: "Medium (5 pack)",
  //           price: 18.99,
  //           description: "Reusable gloves for handling strong chemicals",
  //         },
  //         quantity: 1,
  //       }
  //     ],
  //     customer: {
  //       id: "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a",
  //       phone: "+12175553456",
  //       last_name: "Wilson",
  //       first_name: "James",
  //     },
  //     company: {
  //       id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
  //       name: "Acme Cleaning and Safety Supply Inc.",
  //       domain: "acmecleaning.com",
  //     },
  //   },
  //   error: null,
  // }
  //
  // Add calculations for line totals, subtotal, taxes, and grand total

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

  // console.log(
  //   `reorderbot_originalAdjusted: validProductSpecials:`,
  //   validProductSpecials
  // );
  //===========================================================
  // Reult of the query will be an array of ProductSpecial objects
  // Favorite products details: {
  //   data: [
  //     {
  //       id: "7a8b9c0d-1e2f-4d13-5c6d-7e8f9a0b1c2d",
  //       name: "Microfiber Cleaning Cloths",
  //       description: "Multi-purpose microfiber cloths for various cleaning tasks",
  //       size: "24 Pack",
  //       price: 29.99,
  //     }, {
  //       id: "9c0d1e2f-3a4b-4f35-7e8f-9a0b1c2d3e4f",
  //       name: "Nitrile Gloves",
  //       description: "Disposable nitrile gloves, powder-free, large size",
  //       size: "Large (100 count)",
  //       price: 24.95,
  //     }, {
  //       id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
  //       name: "Hand Sanitizer Gel",
  //       description: "70% alcohol-based hand sanitizer gel with pump",
  //       size: "1 Gallon",
  //       price: 29.99,
  //     }
  //   ],
  //   error: null,
  // }

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

    //console.log("Favorite products details:", favoriteProducts);

    // result of the query will be an array of product objects
    // Example output:
    //     Favorite products details: {
    //   data: [
    //     {
    //       id: "7a8b9c0d-1e2f-4d13-5c6d-7e8f9a0b1c2d",
    //       name: "Microfiber Cleaning Cloths",
    //       description: "Multi-purpose microfiber cloths for various cleaning tasks",
    //       size: "24 Pack",
    //       price: 29.99,
    //     }, {
    //       id: "9c0d1e2f-3a4b-4f35-7e8f-9a0b1c2d3e4f",
    //       name: "Nitrile Gloves",
    //       description: "Disposable nitrile gloves, powder-free, large size",
    //       size: "Large (100 count)",
    //       price: 24.95,
    //     }, {
    //       id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
    //       name: "Hand Sanitizer Gel",
    //       description: "70% alcohol-based hand sanitizer gel with pump",
    //       size: "1 Gallon",
    //       price: 29.99,
    //     }
    //   ],
    //   error: null,
    // }
  }

  // ========================================================

  // Get the tools
  const tool_sendSmsOrderUpdate = {
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
                description: "Total for this line item (quantity × unitPrice)",
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
  };

  agent.tool = tool_sendSmsOrderUpdate;

  //   agent.prompt = `

  // ## Order Management Instructions

  // You are helping the customer review and modify their proposed order using the data provided below.

  // ${agent.xmlCustomer}

  // ${agent.xmlCompany}

  // ${agent.xmlProposedOrder}

  // ${agent.xmlProductSpecials}

  // ${agent.xmlFavoriteProducts}

  // The customer can modify their order by adding, removing, or changing quantities. After any changes, use the sendSmsOrderUpdate tool with the customer and company information provided above.

  // `;

  //   console.log("Agent prompt:", agent.prompt);

  // Get the agent
  const agentFilePath =
    "C:/Users/3900X/Code/vapiordie3/vapiordie3/src/assistants/domain/acmecleaning.com/testsms/testSms.md";
  //   let prompt_testSms: string | null = null;
  //   try {
  //     prompt_testSms = await fs.readFile(agentFilePath, "utf-8");
  //     console.log("Agent file contents loaded.\n", prompt_testSms);
  //   } catch (err) {
  //     console.error("Failed to read agent file:", err);
  //   }

  //  agent.prompt = prompt_testSms

  // Function to read prompt template from file and insert agent values
  function buildPromptFromFile(templateFilePath, agent) {
    try {
      // Read the template file
      const promptTemplate = fs.readFileSync(templateFilePath, "utf8");

      // Replace template variables with actual values using a template literal function
      const interpolate = (template, variables) => {
        return new Function(
          ...Object.keys(variables),
          `return \`${template}\`;`
        )(...Object.values(variables));
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
    console.log("Agent prompt:", agent.prompt);
  } catch (error) {
    console.error("Failed to build prompt:", error);
  }

  // Get the guardrails

  // Get the data objects

  // Merge everything

  return c.json(proposedOrder, 200);
  process.exitCode = 0;

  // try {
  //   const response = await fetch(`${envConfig.vapi.baseUrl}/call/phone`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${envConfig.vapi.apiKey}`,
  //     },
  //     body: JSON.stringify({
  //       phoneNumberId: phoneNumberId,
  //       assistantId: assistantId,
  //       customer: {
  //         number: customerNumber,
  //       },
  //     }),
  //   });

  //   if (!response.ok) {
  //     const errorBody = await response
  //       .text()
  //       .catch(() => "Could not read error body");
  //     throw new Error(
  //       `HTTP error! status: ${response.status}, body: ${errorBody}`
  //     );
  //   }

  //   const data = await response.json();
  //   return c.json(data, 200);
  // } catch (error) {
  //   console.error("VAPI call failed:", error);
  //   const errorMessage =
  //     error instanceof Error
  //       ? error.message
  //       : "An unknown error occurred during VAPI call";
  //   return c.json(
  //     {
  //       message: "Failed to place outbound call",
  //       error: errorMessage,
  //     },
  //     500
  //   );
  // }
});

export { app as reorderbotRoute };
