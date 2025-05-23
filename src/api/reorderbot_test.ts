import { createRepository } from "../supabase/generated-repo";
import { supabaseClient as anonSupabaseClient } from "../supabase/client";
import {
  createClient,
  User as AuthUser,
  AuthError,
  isAuthError,
} from "@supabase/supabase-js";
import {
  tenantsRowSchema,
  usersRowSchema,
  usersInsertSchema,
  customersRowSchema,
  customersInsertSchema,
  ordersRowSchema,
  ordersInsertSchema,
  orderItemsRowSchema,
  orderItemsInsertSchema,
  proposedOrdersRowSchema,
  proposedOrdersInsertSchema,
  orderStatusSchema,
  jsonSchema,
  productsRowSchema,
} from "../supabase/generated.schemas";
import { z, ZodError } from "zod";
import "dotenv/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "FATAL ERROR: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (from .env) must be set."
  );
  process.exit(1);
}
const adminSupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
console.log("Admin Supabase client initialized.");

type Tenant = z.output<typeof tenantsRowSchema>;
async function getTenantByDomain(domainToFind: string): Promise<Tenant | null> {
  const tenantsRepo = createRepository("tenants");
  try {
    const allTenants = await tenantsRepo.getAll();
    const foundTenantData = allTenants.find(
      (item) => (item as Partial<Tenant>).domain === domainToFind
    );
    if (foundTenantData) return tenantsRowSchema.parse(foundTenantData);
    return null;
  } catch (e: any) {
    console.error(`getTenantByDomain Error: ${e.message}`);
    return null;
  }
}

type UserRow = z.output<typeof usersRowSchema>;
type UserInsertInput = z.input<typeof usersInsertSchema>;
type CustomerRow = z.output<typeof customersRowSchema>;
type CustomerInsertInput = z.input<typeof customersInsertSchema>;
type OrderRow = z.output<typeof ordersRowSchema>;
type OrderInsertInput = z.input<typeof ordersInsertSchema>;
type OrderItemRow = z.output<typeof orderItemsRowSchema>;
type OrderItemInsertInput = z.input<typeof orderItemsInsertSchema>;
type ProductRow = z.output<typeof productsRowSchema>;

type ProposedOrderRow = z.output<typeof proposedOrdersRowSchema>;
type ProposedOrderInsertInput = z.input<typeof proposedOrdersInsertSchema>;

const phoneForWorkflow = "+17787754146";
const tenantIdForWorkflow = "f0555d1a-5da7-4d15-b864-a1c6b16458a8";
const DEFAULT_ORDER_ID = "your-default-order-id-uuid";
const DEFAULT_CUSTOMER_ID = "your-default-customer-id-uuid";
const PLACEHOLDER_CALL_ID = "test-call-id-reorderbot";

const COMPLETED_ORDER_STATUSES: z.infer<typeof orderStatusSchema>[] = [
  "delivered",
  "user_confirmed",
  "accepted",
  "shipped",
];

async function findAuthUserByPhoneWithAdmin(
  phoneNumber: string
): Promise<AuthUser | null> {
  console.log(`findAuthUserByPhoneWithAdmin: Searching for ${phoneNumber}`);
  try {
    const {
      data: { users },
      error,
    } = await adminSupabaseClient.auth.admin.listUsers({
      page: 1,
      perPage: 10000,
    });
    if (error) {
      console.error("findAuthUserByPhoneWithAdmin: listUsers error", error);
      return null;
    }
    if (!users) {
      console.error("findAuthUserByPhoneWithAdmin: No users array returned.");
      return null;
    }
    for (const user of users) {
      if (user.phone === phoneNumber) {
        console.log(`findAuthUserByPhoneWithAdmin: Found user ID ${user.id}`);
        return user;
      }
    }
    console.log(
      `findAuthUserByPhoneWithAdmin: No user found for ${phoneNumber}`
    );
    return null;
  } catch (e: any) {
    console.error(`findAuthUserByPhoneWithAdmin: Exception: ${e.message}`, e);
    return null;
  }
}

async function createUserWithProfileAndAdmin(
  phoneNumber: string,
  tenantId: string
): Promise<UserRow | null> {
  console.log(
    `createUserWithProfileAndAdmin: Attempting for phone: ${phoneNumber}`
  );
  let authUser: AuthUser | null = null;
  try {
    const { data: createData, error: createAuthUserError } =
      await adminSupabaseClient.auth.admin.createUser({
        phone: phoneNumber,
        password: Math.random().toString(36).slice(-10),
        phone_confirm: true,
      });
    if (createAuthUserError) {
      if (
        isAuthError(createAuthUserError) &&
        (createAuthUserError.code === "phone_exists" ||
          createAuthUserError.message
            .toLowerCase()
            .includes("phone number already registered"))
      ) {
        console.warn(
          `createUserWithProfileAndAdmin: Phone ${phoneNumber} already registered. Fetching existing.`
        );
        authUser = await findAuthUserByPhoneWithAdmin(phoneNumber);
        if (!authUser)
          throw new Error(
            `Phone exists (per createUser) but could not fetch user: ${phoneNumber}`
          );
        console.log(
          `createUserWithProfileAndAdmin: Fetched existing auth user: ${authUser.id}`
        );
      } else throw createAuthUserError;
    } else if (createData?.user) {
      authUser = createData.user;
      console.log(
        `createUserWithProfileAndAdmin: Auth user created: ${authUser.id}`
      );
    } else
      throw new Error(
        "Auth user creation failed: no user object and no specific error."
      );

    if (!authUser) throw new Error("Auth user could not be established.");

    const userProfileData: UserInsertInput = {
      id: authUser.id,
      email:
        authUser.email ||
        `${phoneNumber.replace(/[^\d]/g, "")}@phonemail.example.com`,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };
    const validatedProfileData = usersInsertSchema.parse(userProfileData);
    const { data: upsertedProfile, error: profileUpsertError } =
      await adminSupabaseClient
        .from("users")
        .upsert(validatedProfileData, { onConflict: "id" })
        .select()
        .single();
    if (profileUpsertError) throw profileUpsertError;
    if (!upsertedProfile) throw new Error("Failed to upsert user profile.");
    console.log(
      `createUserWithProfileAndAdmin: Profile upserted: ${
        (upsertedProfile as UserRow).id
      }`
    );
    return usersRowSchema.parse(upsertedProfile);
  } catch (e: any) {
    console.error(
      `createUserWithProfileAndAdmin Error: ${e.message}`,
      isAuthError(e) ? { s: e.status, c: e.code } : e
    );
    return null;
  }
}

async function getCustomerByUserIdFromDb(
  userId: string
): Promise<CustomerRow | null> {
  const repo = createRepository("customers");
  try {
    const all = await repo.getAll();
    const data = all.find(
      (c) => (c as Partial<CustomerRow>).user_id === userId
    );
    if (data) return customersRowSchema.parse(data);
    return null;
  } catch (e: any) {
    console.error(`getCustomerByUserIdFromDb Error: ${e.message}`);
    return null;
  }
}

async function createCustomerInDb(
  userId: string,
  tenantId: string
): Promise<CustomerRow | null> {
  const repo = createRepository("customers");
  try {
    const customerData: CustomerInsertInput = {
      user_id: userId,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      first_name: "DefaultFirst",
      last_name: "DefaultLast",
      email: `${userId.substring(0, 8)}@customerexample.com`,
    };
    const validated = customersInsertSchema.parse(customerData);
    const newData = await repo.create(validated);
    if (!newData) throw new Error("Repo create returned null");
    return customersRowSchema.parse(newData);
  } catch (e: any) {
    console.error(`createCustomerInDb Error: ${e.message}`);
    return null;
  }
}

async function getLastOrderByCustomerIdFromDb(
  customerId: string
): Promise<OrderRow | null> {
  const repo = createRepository("orders");
  console.log(
    `getLastOrderByCustomerIdFromDb: Fetching last order for customer ${customerId}`
  );
  try {
    const all = await repo.getAll();
    const customerOrders = all.filter(
      (o) =>
        (o as OrderRow).customer_id === customerId &&
        COMPLETED_ORDER_STATUSES.includes((o as OrderRow).status as any)
    );
    console.log(
      `getLastOrderByCustomerIdFromDb: Found ${customerOrders.length} completed orders for customer ${customerId}`
    );
    if (customerOrders.length === 0) return null;
    customerOrders.sort(
      (a, b) =>
        new Date((b as OrderRow).created_at || 0).getTime() -
        new Date((a as OrderRow).created_at || 0).getTime()
    );
    const lastOrder = ordersRowSchema.parse(customerOrders[0]);
    console.log(
      `getLastOrderByCustomerIdFromDb: Last order ID: ${lastOrder.id}`
    );
    return lastOrder;
  } catch (e: any) {
    console.error(`getLastOrderByCustomerIdFromDb Error: ${e.message}`);
    return null;
  }
}

async function getDefaultOrderFromDb(
  orderId: string
): Promise<OrderRow | null> {
  const repo = createRepository("orders");
  try {
    const data = await repo.getById(orderId);
    if (data) return ordersRowSchema.parse(data);
    console.log(
      `getDefaultOrderFromDb: Default order not found for ID ${orderId}`
    );
    return null;
  } catch (e: any) {
    console.error(
      `getDefaultOrderFromDb Error for ID ${orderId}: ${e.message}`
    );
    return null;
  }
}

async function createLastOrderInDb(
  customerId: string,
  tenantId: string,
  defaultOrder: OrderRow
): Promise<OrderRow | null> {
  const repo = createRepository("orders");
  try {
    const orderData: OrderInsertInput = {
      customer_id: customerId,
      tenant_id: tenantId,
      status: "delivered",
      total_amount: defaultOrder.total_amount || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: defaultOrder.notes || "Created from default order",
      order_date: new Date().toISOString(),
    };
    const validated = ordersInsertSchema.parse(orderData);
    const newData = await repo.create(validated);
    if (!newData) throw new Error("Repo create returned null");
    return ordersRowSchema.parse(newData);
  } catch (e: any) {
    console.error(`createLastOrderInDb Error: ${e.message}`);
    return null;
  }
}

async function getDefaultOrderItemsFromDb(
  orderId: string
): Promise<OrderItemRow[]> {
  const repo = createRepository("order_items");
  console.log(
    `getDefaultOrderItemsFromDb: Fetching items for default order ID ${orderId}`
  );
  try {
    const all = await repo.getAll();
    const items = all.filter(
      (item) => (item as Partial<OrderItemRow>).order_id === orderId
    );
    console.log(
      `getDefaultOrderItemsFromDb: Found ${items.length} items for order ID ${orderId}`
    );
    return items.map((item) => orderItemsRowSchema.parse(item));
  } catch (e: any) {
    console.error(`getDefaultOrderItemsFromDb Error: ${e.message}`);
    return [];
  }
}

async function createOrderItemsInDb(
  orderId: string,
  tenantId: string,
  items: Partial<OrderItemInsertInput>[]
): Promise<OrderItemRow[]> {
  const repo = createRepository("order_items");
  const created: OrderItemRow[] = [];
  console.log(
    `createOrderItemsInDb: Creating ${items.length} items for order ID ${orderId}`
  );
  try {
    for (const item of items) {
      const itemToInsert: OrderItemInsertInput = {
        order_id: orderId,
        product_id: item.product_id!,
        quantity: item.quantity!,
        price: item.price!,
        tenant_id: tenantId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        discount: item.discount || 0,
      };
      const validated = orderItemsInsertSchema.parse(itemToInsert);
      const newItem = await repo.create(validated);
      if (!newItem) throw new Error(`Failed for product ${item.product_id}`);
      created.push(orderItemsRowSchema.parse(newItem));
    }
    console.log(
      `createOrderItemsInDb: Successfully created ${created.length} items.`
    );
    return created;
  } catch (e: any) {
    console.error(`createOrderItemsInDb Error: ${e.message}`);
    return [];
  }
}

async function getProductDetailsById(
  productId: string
): Promise<ProductRow | null> {
  if (!productId) {
    console.warn(
      "getProductDetailsById: Received null or undefined productId."
    );
    return null;
  }
  const repo = createRepository("products");
  try {
    const product = await repo.getById(productId);
    if (product) {
      return productsRowSchema.parse(product);
    }
    console.warn(
      `getProductDetailsById: Product not found for ID ${productId}`
    );
    return null;
  } catch (e: any) {
    console.error(
      `getProductDetailsById Error for ID ${productId}: ${e.message}`
    );
    return null;
  }
}

async function getProposedOrderByCustomerIdFromDb(
  customerId: string
): Promise<ProposedOrderRow | null> {
  const repo = createRepository("proposed_orders");
  console.log(
    `getProposedOrderByCustomerIdFromDb: Fetching proposed orders for customer ${customerId}`
  );
  try {
    const allProposed = await repo.getAll();
    const customerProposedOrders = allProposed.filter(
      (p) => (p as ProposedOrderRow).customer_id === customerId
    );

    console.log(
      `getProposedOrderByCustomerIdFromDb: Found ${customerProposedOrders.length} proposed orders for customer ${customerId}.`
    );
    customerProposedOrders.forEach((p) => {
      console.log(
        `getProposedOrderByCustomerIdFromDb: Candidate Proposed Order - ID: ${
          (p as ProposedOrderRow).id
        }, Status: ${(p as ProposedOrderRow).status}, Created: ${
          (p as ProposedOrderRow).created_at
        }`
      );
      // console.log(`getProposedOrderByCustomerIdFromDb: Candidate Items: ${JSON.stringify((p as ProposedOrderRow).order_items)}`); // Log items if needed
    });

    if (customerProposedOrders.length === 0) {
      console.log(
        `getProposedOrderByCustomerIdFromDb: No proposed orders found for customer ${customerId}.`
      );
      return null;
    }

    customerProposedOrders.sort(
      (a, b) =>
        new Date((b as ProposedOrderRow).created_at).getTime() -
        new Date((a as ProposedOrderRow).created_at).getTime()
    );

    const draftProposedOrder = customerProposedOrders.find(
      (p) => (p as ProposedOrderRow).status === "draft"
    );
    let latestProposed: ProposedOrderRow | undefined = draftProposedOrder;

    if (draftProposedOrder) {
      console.log(
        `getProposedOrderByCustomerIdFromDb: Found DRAFT proposed order ID: ${draftProposedOrder.id}`
      );
    } else {
      latestProposed = customerProposedOrders[0]; // Fallback to most recent if no draft
      console.log(
        `getProposedOrderByCustomerIdFromDb: No DRAFT found, falling back to most recent proposed order ID: ${latestProposed?.id}`
      );
    }

    if (!latestProposed) {
      // Should not happen if customerProposedOrders.length > 0
      console.log(
        `getProposedOrderByCustomerIdFromDb: No suitable proposed order found after filtering/sorting for customer ${customerId}.`
      );
      return null;
    }
    console.log(
      `getProposedOrderByCustomerIdFromDb: Selected proposed order ID: ${latestProposed.id} for customer ${customerId}. Items:`,
      JSON.stringify(latestProposed.order_items, null, 2)
    );
    return proposedOrdersRowSchema.parse(latestProposed);
  } catch (e: any) {
    console.error(`getProposedOrderByCustomerIdFromDb Error: ${e.message}`);
    return null;
  }
}

async function createProposedOrderInDb(
  customerId: string,
  tenantId: string,
  lastOrderWithItems: OrderRow & { items: OrderItemRow[] }
): Promise<ProposedOrderRow | null> {
  const repo = createRepository("proposed_orders");
  try {
    console.log(
      `createProposedOrderInDb: Creating proposed order for customer ${customerId} based on last order ID ${lastOrderWithItems.id}. Number of items in last order: ${lastOrderWithItems.items.length}`
    );
    if (lastOrderWithItems.items.length === 0) {
      console.warn(
        "createProposedOrderInDb: Last order has no items. Proposed order will have empty items list."
      );
    }
    const productDetailsPromises = lastOrderWithItems.items.map((item) =>
      item.product_id
        ? getProductDetailsById(item.product_id)
        : Promise.resolve(null)
    );
    const productDetailsList = await Promise.all(productDetailsPromises);
    console.log(
      `createProposedOrderInDb: Fetched ${
        productDetailsList.filter((p) => p).length
      } product details out of ${lastOrderWithItems.items.length} items.`
    );

    const orderItemsForJson: any[] = lastOrderWithItems.items.map(
      (item, index) => {
        const product = productDetailsList[index];
        const newItemJson = {
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          product_description: product?.description || null,
          product_size: product?.size || null,
        };
        console.log(
          `createProposedOrderInDb: Mapped item for JSON (item index ${index}): ${JSON.stringify(
            newItemJson
          )}`
        );
        return newItemJson;
      }
    );

    const proposedOrderData: ProposedOrderInsertInput = {
      customer_id: customerId,
      tenant_id: tenantId,
      status: "draft",
      total: lastOrderWithItems.total_amount || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      proposed_date: new Date().toISOString(),
      order_items: orderItemsForJson,
      call_id: PLACEHOLDER_CALL_ID,
    };
    const validatedData = proposedOrdersInsertSchema.parse(proposedOrderData);
    console.log(
      "createProposedOrderInDb: Validated proposed order data. Order items to be inserted:",
      JSON.stringify(validatedData.order_items, null, 2)
    );

    const newProposedOrder = await repo.create(validatedData);
    if (!newProposedOrder)
      throw new Error("Repo create for proposed_order returned null");

    console.log(
      "createProposedOrderInDb: Successfully created proposed order in DB:",
      newProposedOrder.id,
      "Items:",
      JSON.stringify(newProposedOrder.order_items, null, 2)
    );
    return proposedOrdersRowSchema.parse(newProposedOrder);
  } catch (e: any) {
    console.error(`createProposedOrderInDb Error: ${e.message}`, e);
    return null;
  }
}

async function getLastOrderWithItemsFromDb(
  customerId: string
): Promise<(OrderRow & { items: OrderItemRow[] }) | null> {
  const orderItemsRepo = createRepository("order_items");
  console.log(
    `getLastOrderWithItemsFromDb: Fetching last order with items for customer ${customerId}`
  );
  try {
    const lastOrder = await getLastOrderByCustomerIdFromDb(customerId);
    if (!lastOrder) {
      console.log(
        `getLastOrderWithItemsFromDb: No last order found for customer ${customerId}.`
      );
      return null;
    }
    console.log(
      `getLastOrderWithItemsFromDb: Found last order ID ${lastOrder.id}. Fetching its items.`
    );
    const allOrderItems = await orderItemsRepo.getAll();
    const itemsData = allOrderItems.filter(
      (item) => (item as Partial<OrderItemRow>).order_id === lastOrder.id
    );
    console.log(
      `getLastOrderWithItemsFromDb: Found ${itemsData.length} items for order ID ${lastOrder.id}.`
    );
    if (itemsData.length === 0) {
      console.warn(
        `getLastOrderWithItemsFromDb: Last order ${lastOrder.id} has no items.`
      );
    }
    const validatedItems = itemsData.map((item) =>
      orderItemsRowSchema.parse(item)
    );
    return { ...lastOrder, items: validatedItems };
  } catch (e: any) {
    console.error(`getLastOrderWithItemsFromDb Error: ${e.message}`);
    return null;
  }
}

async function handleUserWorkflow(): Promise<Object | null> {
  let userProfile: UserRow | null = null;
  console.log("handleUserWorkflow: Starting...");
  try {
    let authUser = await findAuthUserByPhoneWithAdmin(phoneForWorkflow);
    if (authUser?.id) {
      console.log(
        `handleUserWorkflow: Auth user found: ${authUser.id}. Ensuring profile.`
      );
      const { data: profile, error: profileError } = await adminSupabaseClient
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();
      if (profileError && profileError.code !== "PGRST116") throw profileError;
      if (profile) userProfile = usersRowSchema.parse(profile);
      else {
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

    let customer = await getCustomerByUserIdFromDb(userProfile.id);
    if (!customer) {
      customer = await createCustomerInDb(userProfile.id, tenantIdForWorkflow);
      if (!customer) throw new Error("Failed to create customer");
    }
    console.log(`handleUserWorkflow: Customer established: ${customer.id}`);

    let lastOrder = await getLastOrderByCustomerIdFromDb(customer.id);
    if (!lastOrder) {
      console.log(
        `handleUserWorkflow: No last order for customer ${customer.id}. Creating from default.`
      );
      const defaultOrder = await getDefaultOrderFromDb(DEFAULT_ORDER_ID);
      if (defaultOrder) {
        lastOrder = await createLastOrderInDb(
          customer.id,
          tenantIdForWorkflow,
          defaultOrder
        );
        if (!lastOrder)
          throw new Error("Failed to create last order from default.");
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
      } else
        console.log(
          `handleUserWorkflow: Default order (ID: ${DEFAULT_ORDER_ID}) not found.`
        );
    }
    console.log(
      `handleUserWorkflow: Last order processed. ID: ${lastOrder?.id}`
    );

    // Instead of getting/creating a proposed order in DB, prepare the data for the agent
    console.log(
      `handleUserWorkflow: Preparing proposed order data from last order for customer ${customer.id}`
    );

    let proposedOrderData: Partial<ProposedOrderInsertInput> | null = null;
    const lastOrderWithItems = await getLastOrderWithItemsFromDb(customer.id);

    if (lastOrderWithItems && lastOrderWithItems.items.length > 0) {
      console.log(
        `handleUserWorkflow: lastOrderWithItems found for customer ${customer.id}. Items count: ${lastOrderWithItems.items.length}`
      );

      // Fetch product details for each item including size and description
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

      proposedOrderData = {
        customer_id: customer.id,
        tenant_id: tenantIdForWorkflow,
        status: "draft",
        total: lastOrderWithItems.total_amount || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        proposed_date: new Date().toISOString(),
        order_items: orderItemsForAgent,
        // call_id will be set after voice agent interaction
        call_id: "pending",
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

    return {
      user: userProfile,
      customer,
      lastOrder,
      proposedOrder: proposedOrderData, // Return the prepared data instead of DB record
    };
  } catch (e: any) {
    console.error(
      `handleUserWorkflow: Main Error: ${e.message}`,
      isAuthError(e) ? { s: e.status, c: e.code } : e
    );
    return null;
  }
}

async function main() {
  console.log("main: Starting reorderbot_test.ts workflow...");
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
