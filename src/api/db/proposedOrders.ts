import { createRepository } from "../../supabase/generated-repo";
import {
  ProposedOrderRow,
  ProposedOrderInsertInput,
  OrderRow,
  OrderItemRow,
} from "./types";
import {
  proposedOrdersRowSchema,
  proposedOrdersInsertSchema,
} from "../../supabase/generated.schemas";
import { getProductDetailsById } from "./products";

const PLACEHOLDER_CALL_ID = "test-call-id-reorderbot";

/**
 * Retrieves proposed orders for a customer
 * @param customerId - The customer ID to get proposed orders for
 * @returns Promise resolving to the most relevant proposed order or null if none found
 */
export async function getProposedOrderByCustomerIdFromDb(
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

    if (!draftProposedOrder) {
      latestProposed = customerProposedOrders[0]; // Fallback to most recent if no draft
    }

    if (!latestProposed) {
      console.log(
        `getProposedOrderByCustomerIdFromDb: No suitable proposed order found after filtering/sorting for customer ${customerId}.`
      );
      return null;
    }

    return proposedOrdersRowSchema.parse(latestProposed);
  } catch (e: any) {
    console.error(`getProposedOrderByCustomerIdFromDb Error: ${e.message}`);
    return null;
  }
}

/**
 * Creates a proposed order based on a previous order
 * @param customerId - The customer ID to create the proposed order for
 * @param tenantId - The tenant ID to associate with the order
 * @param lastOrderWithItems - The previous order with items to base the proposed order on
 * @returns Promise resolving to the created proposed order or null if creation fails
 */
export async function createProposedOrderInDb(
  customerId: string,
  tenantId: string,
  lastOrderWithItems: OrderRow & { items: OrderItemRow[] }
): Promise<ProposedOrderRow | null> {
  const repo = createRepository("proposed_orders");
  try {
    if (lastOrderWithItems.items.length === 0) {
      console.warn(
        "createProposedOrderInDb: Last order has no items. Proposed order will have empty items list."
      );
    }

    // Fetch product details for each item
    const productDetailsList = await Promise.all(
      lastOrderWithItems.items.map((item) =>
        item.product_id
          ? getProductDetailsById(item.product_id)
          : Promise.resolve(null)
      )
    );

    const orderItemsForJson = lastOrderWithItems.items.map((item, index) => {
      const product = productDetailsList[index];
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product_description: product?.description || null,
        product_size: product?.size || null,
      };
    });

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
    const newProposedOrder = await repo.create(validatedData);
    if (!newProposedOrder)
      throw new Error("Repo create for proposed_order returned null");

    return proposedOrdersRowSchema.parse(newProposedOrder);
  } catch (e: any) {
    console.error(`createProposedOrderInDb Error: ${e.message}`, e);
    return null;
  }
}
