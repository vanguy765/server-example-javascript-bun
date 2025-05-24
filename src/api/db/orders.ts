import { createRepository } from "../../supabase/generated-repo";
import {
  OrderRow,
  OrderItemRow,
  OrderInsertInput,
  OrderItemInsertInput,
  COMPLETED_ORDER_STATUSES,
} from "./types";
import {
  ordersRowSchema,
  ordersInsertSchema,
  orderItemsRowSchema,
  orderItemsInsertSchema,
} from "../../supabase/generated.schemas";

/**
 * Retrieves the last order for a given customer ID
 * @param customerId - The customer ID to find orders for
 * @returns Promise resolving to the most recent order or null if none found
 */
export async function getLastOrderByCustomerIdFromDb(
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

/**
 * Retrieves a default order by its ID
 * @param orderId - The ID of the order to retrieve
 * @returns Promise resolving to the order or null if not found
 */
export async function getDefaultOrderFromDb(
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

/**
 * Creates a new order based on a default order template
 * @param customerId - The customer ID to create the order for
 * @param tenantId - The tenant ID to associate with the order
 * @param defaultOrder - The default order to base the new order on
 * @returns Promise resolving to the created order or null if creation fails
 */
export async function createLastOrderInDb(
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

/**
 * Retrieves order items for a default order
 * @param orderId - The ID of the order to get items for
 * @returns Promise resolving to an array of order items
 */
export async function getDefaultOrderItemsFromDb(
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

/**
 * Creates multiple order items in the database
 * @param orderId - The ID of the order to create items for
 * @param tenantId - The tenant ID to associate with the items
 * @param items - Array of order items to create
 * @returns Promise resolving to an array of created order items
 */
export async function createOrderItemsInDb(
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

/**
 * Retrieves the last order with its items for a customer
 * @param customerId - The customer ID to get the order for
 * @returns Promise resolving to the order with its items or null if not found
 */
export async function getLastOrderWithItemsFromDb(
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
