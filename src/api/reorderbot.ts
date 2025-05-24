// =============================================================================
// IMPORTS AND DEPENDENCIES
// =============================================================================
import { createRepository } from "../supabase/generated-repo";
import { createClient } from "@supabase/supabase-js";
import { AuthUser, isAuthError } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";
import { z } from "zod";
import {
  usersRowSchema,
  usersInsertSchema,
  ordersRowSchema,
  ordersInsertSchema,
  orderStatusSchema,
} from "../supabase/generated.schemas";
import {
  UserRow,
  UserInsertInput,
  CustomerRow,
  OrderRow,
  OrderItemRow,
  OrderInsertInput,
  ProposedOrderInsertInput,
  EnhancedProposedOrder,
  COMPLETED_ORDER_STATUSES,
} from "./db/types";

// =============================================================================
// CONFIGURATION AND INITIALIZATION
// =============================================================================
// Create admin client
const adminSupabaseClient = createClient(
  envConfig.supabase.url,
  envConfig.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Import modularized components
import {
  findAuthUserByPhoneWithAdmin,
  createUserWithProfileAndAdmin,
} from "./db/auth";
import { getCustomerByUserIdFromDb, createCustomerInDb } from "./db/customers";
import {
  getLastOrderByCustomerIdFromDb,
  getDefaultOrderFromDb,
  createLastOrderInDb,
  getDefaultOrderItemsFromDb,
  createOrderItemsInDb,
  getLastOrderWithItemsFromDb,
} from "./db/orders";
import { getProductDetailsById } from "./db/products";
import { UUID } from "crypto";

// =============================================================================
// GLOBAL CONSTANTS AND CONFIGURATION
// =============================================================================
const phoneForWorkflow = "+17787754146";
let tenantIdForWorkflow = "f0555d1a-5da7-4d15-b864-a1c6b16458a8"; // Default tenant ID
let tenantForWorkflow: any = null; // Global variable to store tenant information
let DEFAULT_ORDER_ID: string | null = null;
const PLACEHOLDER_CALL_ID = "test-call-id-reorderbot";

// =============================================================================
// DEFAULT ORDER INITIALIZATION
// =============================================================================
async function initializeDefaultOrder() {
  if (DEFAULT_ORDER_ID) return; // Already initialized

  // First try to load from environment variable
  DEFAULT_ORDER_ID = process.env.DEFAULT_ORDER_TEMPLATE_ID || null;

  if (!DEFAULT_ORDER_ID) {
    console.log(
      "No default order template ID found in environment, creating new template..."
    );

    // Default items from the hospital monthly order template
    const defaultItems = [
      {
        productId: "4b5c6d7e-8f9a-4e8a-c2d3-e4f5a6b7c8d9",
        quantity: 2,
        price: 39.99,
      },
      {
        productId: "5c6d7e8f-9a0b-4f9b-d3e4-f5a6b7c8d9e0",
        quantity: 5,
        price: 12.99,
      },
      {
        productId: "9c0d1e2f-3a4b-4f35-7e8f-9a0b1c2d3e4f",
        quantity: 10,
        price: 24.95,
      },
      {
        productId: "1e2f3a4b-5c6d-4b57-9a0b-1c2d3e4f5a6b",
        quantity: 2,
        price: 39.99,
      },
    ];

    const template = await setupDefaultOrderTemplate(
      tenantIdForWorkflow,
      defaultItems
    );
    if (template) {
      DEFAULT_ORDER_ID = template.orderId;
      console.log(
        `Created new default order template with ID: ${DEFAULT_ORDER_ID}`
      );
    } else {
      console.error("Failed to create default order template");
      process.exit(1);
    }
  }
}

// =============================================================================
// TENANT FUNCTIONS
// =============================================================================
async function getTenantFromDomain(): Promise<any> {
  const domain = "acmecleaning.com";
  console.log(`getTenantFromDomain: Using domain "${domain}"`);

  try {
    const { data: tenantData, error: tenantError } = await adminSupabaseClient
      .from("tenants")
      .select("*")
      .eq("domain", domain)
      .single();

    if (tenantError) {
      console.error(`Error fetching tenant for domain ${domain}:`, tenantError);
      // Return default tenant object for error case
      return {
        id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
        name: "Acme Cleaning",
        domain: "acmecleaning.com",
      };
    }

    if (!tenantData) {
      console.warn(`No tenant found for domain ${domain}`);
      // Return default tenant object when no tenant is found
      return {
        id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
        name: "Acme Cleaning",
        domain: "acmecleaning.com",
      };
    }

    console.log(
      `getTenantFromDomain: Found tenant for domain "${domain}":`,
      JSON.stringify(tenantData, null, 2)
    );

    return tenantData;
  } catch (e: any) {
    console.error(`getTenantFromDomain Error: ${e.message}`, e);
    // Return default tenant object for any exceptions
    return {
      id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
      name: "Acme Cleaning",
      domain: "acmecleaning.com",
    };
  }
}

async function getTenantIdFromDomain(): Promise<string> {
  // let domain = envConfig.supabase.url.split(".")[0].replace("https://", "");  if (domain === "localhost") {
  //   domain = "acmecleaning.com";
  // }
  // Use the domain from environment or the default for localhost

  const domain = "acmecleaning.com";
  console.log(`getTenantIdFromDomain: Using domain "${domain}"`);

  try {
    const { data: tenantData, error: tenantError } = await adminSupabaseClient
      .from("tenants")
      .select("*")
      .eq("domain", domain)
      .single();

    if (tenantError) {
      console.error(`Error fetching tenant for domain ${domain}:`, tenantError);
      // Return default tenant ID for error case
      return "f0555d1a-5da7-4d15-b864-a1c6b16458a8";
    }

    if (!tenantData) {
      console.warn(`No tenant found for domain ${domain}`);
      // Return default tenant ID when no tenant is found
      return "f0555d1a-5da7-4d15-b864-a1c6b16458a8";
    }

    console.log(
      `getTenantIdFromDomain: Found tenant for domain "${domain}":`,
      JSON.stringify(tenantData, null, 2)
    );

    return tenantData.id;
  } catch (e: any) {
    console.error(`getTenantIdFromDomain Error: ${e.message}`, e);
    // Return default tenant ID for any exceptions
    return "f0555d1a-5da7-4d15-b864-a1c6b16458a8";
  }
}

// COMPLETED_ORDER_STATUSES is now imported from ./db/types

// =============================================================================
// MAIN USER WORKFLOW HANDLER
// =============================================================================
/**
 * Handles the complete user workflow for the reorder bot:
 * 1. Finds/creates user authentication and profile
 * 2. Establishes customer record
 * 3. Retrieves or creates last order
 * 4. Prepares proposed order data for the agent
 *
 * @returns Object containing user profile, customer, last order, and proposed order data
 */
async function handleUserWorkflow(): Promise<Object | null> {
  let userProfile: UserRow | null = null;
  console.log("handleUserWorkflow: Starting...");
  try {
    // Get tenant id from domain

    // SECTION 1: User Authentication and Profile Setup
    // ---------------------------------------------
    // Check if user exists in auth system
    let authUser = await findAuthUserByPhoneWithAdmin(phoneForWorkflow);
    if (authUser?.id) {
      console.log(
        `handleUserWorkflow: Auth user found: ${authUser.id}. Ensuring profile.`
      );
      // Try to fetch existing user profile
      const { data: profile, error: profileError } = await adminSupabaseClient
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      if (profileError && profileError.code !== "PGRST116") throw profileError;

      if (profile) {
        // Use existing profile
        userProfile = usersRowSchema.parse(profile);
      } else {
        // Create new profile for existing auth user
        const profileData: UserInsertInput = {
          id: authUser.id,
          email:
            authUser.email ||
            `${phoneForWorkflow.replace(/[^\d]/g, "")}@phonemail.example.com`,
          tenant_id: tenantIdForWorkflow,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
        };
        // Validate and insert new profile
        const validated = usersInsertSchema.parse(profileData);
        const { data: newProf, error: insError } = await adminSupabaseClient
          .from("users")
          .insert(validated)
          .select()
          .single();
        if (insError) throw insError;
        if (!newProf)
          throw new Error("Failed to create profile for existing auth user.");
        userProfile = usersRowSchema.parse(newProf);
      }
    } else {
      // Create new user and profile if auth user doesn't exist
      console.log(
        "handleUserWorkflow: No auth user found. Creating user and profile."
      );
      userProfile = await createUserWithProfileAndAdmin(
        phoneForWorkflow,
        tenantIdForWorkflow
      );
      if (!userProfile) throw new Error("Failed to create/establish user.");
    }
    if (!userProfile) throw new Error("User profile is null.");
    console.log(
      `handleUserWorkflow: User profile established: ${userProfile.id}`
    );

    // SECTION 2: Customer Record Management
    // ---------------------------------------------
    // Get or create customer record for the user
    let customer = await getCustomerByUserIdFromDb(userProfile.id);
    if (!customer) {
      customer = await createCustomerInDb(userProfile.id, tenantIdForWorkflow);
      if (!customer) throw new Error("Failed to create customer");
    }
    console.log(`handleUserWorkflow: Customer established: ${customer.id}`);

    // SECTION 3: Last Order Processing
    // ---------------------------------------------
    // Attempt to get customer's last order
    let lastOrder = null;
    if (customer.id) {
      lastOrder = await getLastOrderByCustomerIdFromDb(customer.id);
    }

    // If no last order exists, create one from default template
    if (!lastOrder && DEFAULT_ORDER_ID) {
      console.log(
        `handleUserWorkflow: No last order for customer ${customer.id}. Creating from default.`
      );
      // Get default order template
      const defaultOrder = await getDefaultOrderFromDb(DEFAULT_ORDER_ID);
      if (defaultOrder) {
        // Create new last order from default template
        lastOrder = await createLastOrderInDb(
          customer.id,
          tenantIdForWorkflow,
          defaultOrder
        );
        if (!lastOrder)
          throw new Error("Failed to create last order from default.");

        // Add default order items if available
        if (DEFAULT_ORDER_ID) {
          const defaultOrderItems = await getDefaultOrderItemsFromDb(
            DEFAULT_ORDER_ID
          );
          if (defaultOrderItems.length > 0) {
            await createOrderItemsInDb(
              lastOrder.id,
              tenantIdForWorkflow,
              defaultOrderItems
            );
          }
        }
      } else {
        console.log(
          `handleUserWorkflow: Default order (ID: ${DEFAULT_ORDER_ID}) not found.`
        );
      }
    }
    console.log(
      `handleUserWorkflow: Last order processed. ID: ${lastOrder?.id}`
    );

    // SECTION 4: Proposed Order Preparation
    // ---------------------------------------------
    // Prepare order data for the agent based on last order
    console.log(
      `handleUserWorkflow: Preparing proposed order data from last order for customer ${customer.id}`
    );
    let proposedOrderData: Partial<EnhancedProposedOrder> | null = null;
    const lastOrderWithItems = await getLastOrderWithItemsFromDb(customer.id);

    if (lastOrderWithItems && lastOrderWithItems.items.length > 0) {
      console.log(
        `handleUserWorkflow: lastOrderWithItems found for customer ${customer.id}. Items count: ${lastOrderWithItems.items.length}`
      );

      // Enhance order items with product details
      const productDetailsPromises = lastOrderWithItems.items.map((item) =>
        item.product_id
          ? getProductDetailsById(item.product_id)
          : Promise.resolve(null)
      );
      const productDetailsList = await Promise.all(productDetailsPromises);
      console.log(
        `handleUserWorkflow: Fetched ${
          productDetailsList.filter((p) => p).length
        } product details out of ${lastOrderWithItems.items.length} items.`
      );

      // Create enhanced order items with product details
      const orderItemsForAgent = lastOrderWithItems.items.map((item, index) => {
        const product = productDetailsList[index];
        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product_description: product?.description || null,
          product_size: product?.size || null,
          product_name: product?.name || "Unknown Product",
        };
      });

      // Prepare the proposed order data structure with enhanced customer information
      proposedOrderData = {
        customer_id: customer.id,
        tenant_id: tenantIdForWorkflow,
        status: "draft",
        total: lastOrderWithItems.total_amount || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        proposed_date: new Date().toISOString(),
        order_items: orderItemsForAgent,
        call_id: "pending",
        // Additional customer information
        customer_first_name: customer.first_name,
        customer_last_name: customer.last_name,
        customer_email: customer.email || undefined,
        tenant_name: tenantForWorkflow?.name || "Acme Cleaning",
      };

      console.log(
        "handleUserWorkflow: Prepared proposed order data for agent. Order items:",
        JSON.stringify(orderItemsForAgent, null, 2)
      );
    } else {
      console.log(
        `handleUserWorkflow: No last order with items found for customer ${customer.id} to base proposed order on.`
      );
    }

    // Return complete workflow data
    return {
      user: userProfile,
      customer,
      lastOrder,
      proposedOrder: proposedOrderData, // Return the prepared data instead of DB record
    };
  } catch (e: any) {
    // Handle and log any errors that occur during the workflow
    console.error(
      `handleUserWorkflow: Main Error: ${e.message}`,
      isAuthError(e) ? { s: e.status, c: e.code } : e
    );
    return null;
  }
}

// =============================================================================
// DEFAULT ORDER TEMPLATE SETUP
// =============================================================================
async function setupDefaultOrderTemplate(
  tenantId: string,
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>
): Promise<{ orderId: string; items: OrderItemRow[] } | null> {
  const ordersRepo = createRepository("orders");
  try {
    // Create the default order
    const orderData: OrderInsertInput = {
      tenant_id: tenantId,
      status: "delivered", // Use delivered status so it's considered a valid last order
      total_amount: 467.92, // Exact total amount from template
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: "Regular monthly order for hospital",
      order_date: new Date().toISOString(),
    };

    const validatedOrder = ordersInsertSchema.parse(orderData);
    const newOrder = await ordersRepo.create(validatedOrder);
    if (!newOrder) throw new Error("Failed to create default order");

    const parsedOrder = ordersRowSchema.parse(newOrder);
    console.log(
      `setupDefaultOrderTemplate: Created default order ${parsedOrder.id}`
    );

    // Create the default order items
    const orderItems = await createOrderItemsInDb(
      parsedOrder.id,
      tenantId,
      items.map((item) => ({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      }))
    );

    if (orderItems.length === 0) {
      throw new Error("Failed to create default order items");
    }

    console.log(
      `setupDefaultOrderTemplate: Created ${orderItems.length} default items`
    );
    return {
      orderId: parsedOrder.id,
      items: orderItems,
    };
  } catch (e: any) {
    console.error(`setupDefaultOrderTemplate Error: ${e.message}`, e);
    return null;
  }
}

// =============================================================================
// MAIN EXECUTION ENTRY POINT
// =============================================================================
async function main() {
  console.log("main: Starting reorderbot_test.ts workflow...");

  // Get the tenant information for this workflow
  tenantForWorkflow = await getTenantFromDomain();
  tenantIdForWorkflow = tenantForWorkflow.id;

  // Initialize default order template
  await initializeDefaultOrder();
  if (!DEFAULT_ORDER_ID) {
    console.error("Failed to initialize default order template");
    return;
  }

  const workflowResult = await handleUserWorkflow();
  if (workflowResult) {
    console.log("\n--- Workflow Result ---");
    console.log(
      "User Profile:",
      JSON.stringify((workflowResult as any).user, null, 2)
    );
    console.log(
      "Customer:",
      JSON.stringify((workflowResult as any).customer, null, 2)
    );
    console.log(
      "Last Order:",
      JSON.stringify((workflowResult as any).lastOrder, null, 2)
    );
    console.log(
      "Proposed Order:",
      JSON.stringify((workflowResult as any).proposedOrder, null, 2)
    ); // This will show what was fetched/created
    console.log("\nmain: Workflow completed.");
  } else {
    console.log(
      "\nmain: Workflow execution failed or returned partial/no result."
    );
  }
}

main().catch((e) => console.error("main: Unhandled error: ", e));
