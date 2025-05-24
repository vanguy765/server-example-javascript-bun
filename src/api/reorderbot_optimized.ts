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

// =============================================================================
// GLOBAL CONSTANTS
// =============================================================================
const DEFAULT_PHONE = "+17787754146";
const DEFAULT_DOMAIN = "acmecleaning.com";
const DEFAULT_TENANT_ID = "f0555d1a-5da7-4d15-b864-a1c6b16458a8";
const DEFAULT_TENANT = {
  id: DEFAULT_TENANT_ID,
  name: "Acme Cleaning",
  domain: DEFAULT_DOMAIN,
};
const PLACEHOLDER_CALL_ID = "test-call-id-reorderbot";

// =============================================================================
// TENANT FUNCTIONS
// =============================================================================
async function getTenantFromDomain(
  domain: string = DEFAULT_DOMAIN
): Promise<any> {
  console.log(`getTenantFromDomain: Using domain "${domain}"`);

  try {
    const { data: tenantData, error: tenantError } = await adminSupabaseClient
      .from("tenants")
      .select("*")
      .eq("domain", domain)
      .single();

    if (tenantError) {
      console.error(`Error fetching tenant for domain ${domain}:`, tenantError);
      return DEFAULT_TENANT;
    }

    if (!tenantData) {
      console.warn(`No tenant found for domain ${domain}`);
      return DEFAULT_TENANT;
    }

    console.log(
      `getTenantFromDomain: Found tenant for domain "${domain}":`,
      JSON.stringify(tenantData, null, 2)
    );

    return tenantData;
  } catch (e: any) {
    console.error(`getTenantFromDomain Error: ${e.message}`, e);
    return DEFAULT_TENANT;
  }
}

// =============================================================================
// DEFAULT ORDER FUNCTIONS
// =============================================================================
async function initializeDefaultOrder(
  tenantId: string
): Promise<string | null> {
  // First try to load from environment variable
  let defaultOrderId = process.env.DEFAULT_ORDER_TEMPLATE_ID || null;

  if (!defaultOrderId) {
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

    const template = await setupDefaultOrderTemplate(tenantId, defaultItems);

    if (template) {
      defaultOrderId = template.orderId;
      console.log(
        `Created new default order template with ID: ${defaultOrderId}`
      );
    } else {
      console.error("Failed to create default order template");
      return null;
    }
  }

  return defaultOrderId;
}

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
// USER WORKFLOW FUNCTIONS
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
async function handleUserWorkflow(
  phone: string,
  tenant: any,
  defaultOrderId: string | null
): Promise<Object | null> {
  let userProfile: UserRow | null = null;
  console.log(`handleUserWorkflow: Starting for phone ${phone}...`);

  try {
    // SECTION 1: User Authentication and Profile Setup
    // ---------------------------------------------
    // Check if user exists in auth system
    let authUser = await findAuthUserByPhoneWithAdmin(phone);
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
            `${phone.replace(/[^\d]/g, "")}@phonemail.example.com`,
          tenant_id: tenant.id,
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
      userProfile = await createUserWithProfileAndAdmin(phone, tenant.id);
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
      customer = await createCustomerInDb(userProfile.id, tenant.id);
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
    if (!lastOrder && defaultOrderId) {
      console.log(
        `handleUserWorkflow: No last order for customer ${customer.id}. Creating from default.`
      );
      // Get default order template
      const defaultOrder = await getDefaultOrderFromDb(defaultOrderId);
      if (defaultOrder) {
        // Create new last order from default template
        lastOrder = await createLastOrderInDb(
          customer.id,
          tenant.id,
          defaultOrder
        );
        if (!lastOrder)
          throw new Error("Failed to create last order from default.");

        // Add default order items if available
        if (defaultOrderId) {
          const defaultOrderItems = await getDefaultOrderItemsFromDb(
            defaultOrderId
          );
          if (defaultOrderItems.length > 0) {
            await createOrderItemsInDb(
              lastOrder.id,
              tenant.id,
              defaultOrderItems
            );
          }
        }
      } else {
        console.log(
          `handleUserWorkflow: Default order (ID: ${defaultOrderId}) not found.`
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
        tenant_id: tenant.id,
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
        tenant_name: tenant.name || "Acme Cleaning",
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
      proposedOrder: proposedOrderData,
      tenant, // Include tenant information in the response
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
// MAIN REORDERBOT FUNCTION
// =============================================================================
/**
 * Main entry point for the reorderbot functionality
 * @param domain Domain name to use for tenant lookup
 * @param phone Phone number of the customer
 * @returns Complete workflow result with user, customer, order, and tenant data
 */
export async function reorderbot(
  domain: string = DEFAULT_DOMAIN,
  phone: string = DEFAULT_PHONE
): Promise<Object | null> {
  console.log(
    `reorderbot: Starting for domain ${domain} and phone ${phone}...`
  );

  try {
    // Get the tenant for this domain
    const tenant = await getTenantFromDomain(domain);
    if (!tenant) {
      console.error(`reorderbot: Failed to get tenant for domain ${domain}`);
      return null;
    }

    // Initialize default order template
    const defaultOrderId = await initializeDefaultOrder(tenant.id);
    if (!defaultOrderId) {
      console.error("reorderbot: Failed to initialize default order template");
      return null;
    }

    // Process the user workflow
    const workflowResult = await handleUserWorkflow(
      phone,
      tenant,
      defaultOrderId
    );

    if (workflowResult) {
      console.log("\n--- Workflow Result ---");
      console.log("Successfully processed reorderbot workflow");
      return workflowResult;
    } else {
      console.log(
        "\nreorderbot: Workflow execution failed or returned partial/no result."
      );
      return null;
    }
  } catch (e: any) {
    console.error(`reorderbot: Unhandled error: ${e.message}`, e);
    return null;
  }
}

// =============================================================================
// DIRECT EXECUTION ENTRY POINT
// =============================================================================
// This is used when the file is run directly, not when imported as a module
if (require.main === module) {
  const main = async () => {
    console.log("main: Starting direct execution of reorderbot.ts...");

    const result = await reorderbot();

    if (result) {
      console.log("\n--- Workflow Result ---");
      console.log(
        "User Profile:",
        JSON.stringify((result as any).user, null, 2)
      );
      console.log(
        "Customer:",
        JSON.stringify((result as any).customer, null, 2)
      );
      console.log(
        "Last Order:",
        JSON.stringify((result as any).lastOrder, null, 2)
      );
      console.log(
        "Proposed Order:",
        JSON.stringify((result as any).proposedOrder, null, 2)
      );
      console.log("Tenant:", JSON.stringify((result as any).tenant, null, 2));
      console.log("\nmain: Workflow completed.");
    } else {
      console.log("\nmain: Workflow execution failed or returned no result.");
    }
  };

  main().catch((e) => console.error("main: Unhandled error: ", e));
}
