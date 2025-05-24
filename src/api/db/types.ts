import { z } from "zod";
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
  productsRowSchema,
} from "../../supabase/generated.schemas";

// Export types for use in other modules
export type Tenant = z.output<typeof tenantsRowSchema>;
export type UserRow = z.output<typeof usersRowSchema>;
export type UserInsertInput = z.input<typeof usersInsertSchema>;
export type CustomerRow = z.output<typeof customersRowSchema>;
export type CustomerInsertInput = z.input<typeof customersInsertSchema>;
export type OrderRow = z.output<typeof ordersRowSchema>;
export type OrderInsertInput = z.input<typeof ordersInsertSchema>;
export type OrderItemRow = z.output<typeof orderItemsRowSchema>;
export type OrderItemInsertInput = z.input<typeof orderItemsInsertSchema>;
export type ProductRow = z.output<typeof productsRowSchema>;
export type ProposedOrderRow = z.output<typeof proposedOrdersRowSchema>;
export type ProposedOrderInsertInput = z.input<
  typeof proposedOrdersInsertSchema
>;

// Enhanced proposed order type that includes additional customer information
export interface EnhancedProposedOrder extends ProposedOrderInsertInput {
  customer_first_name?: string;
  customer_last_name?: string;
  customer_email?: string;
  tenant_name?: string;
}

export const COMPLETED_ORDER_STATUSES: z.infer<typeof orderStatusSchema>[] = [
  "delivered",
  "user_confirmed",
  "accepted",
  "shipped",
];
