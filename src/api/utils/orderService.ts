/**
 * Order Services
 *
 * This module contains functions for working with orders, including:
 * - Fetching customer orders
 * - Formatting orders for display/processing
 * - Calculating order totals and taxes
 */

import { buildDynamicQuery } from "./queryBuilder";

/**
 * Interface for customer information within an order
 */
export interface OrderCustomer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
}

/**
 * Interface for company information within an order
 */
export interface OrderCompany {
  id: string;
  name: string;
  domain: string;
}

/**
 * Interface for product information within an order item
 */
export interface OrderProduct {
  id: string;
  name: string;
  description: string;
  size: string;
  price: number;
}

/**
 * Interface for an order line item
 */
export interface OrderLineItem {
  id: string;
  quantity: number;
  product: OrderProduct;
  lineTotal?: number; // Calculated field
}

/**
 * Interface for a customer's order
 */
export interface ProposedOrder {
  id: string;
  order_date: string;
  status: string;
  lineItems: OrderLineItem[];
  customer: OrderCustomer;
  company: OrderCompany;
  subTotal?: number; // Calculated field
  GST?: number; // Calculated field
  PST?: number; // Calculated field
  total?: number; // Calculated field
}

/**
 * Fetches a customer's last order from the database
 *
 * @param customerId - The ID of the customer
 * @returns A promise with the customer's last order or null if not found
 */
export async function fetchCustomerLastOrder(customerId: string) {
  return await buildDynamicQuery<"orders", ProposedOrder>("orders", {
    columns: ["id", "order_date", "status"],
    filters: [
      {
        column: "customer_id",
        operator: "eq",
        value: customerId,
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
  });
}

/**
 * Calculate line totals, subtotal, and taxes for an order
 *
 * @param orderData - The order data to process
 * @returns The order with calculated totals
 */
export function calculateOrderTotals(orderData: ProposedOrder): ProposedOrder {
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
  const GST = Number((subTotal * 0.07).toFixed(2)); // 7% GST
  const PST = Number((subTotal * 0.06).toFixed(2)); // 6% PST
  const total = Number((subTotal + GST + PST).toFixed(2));

  // Return enhanced order data
  return {
    ...orderData,
    subTotal,
    GST,
    PST,
    total,
  };
}

/**
 * Separates customer and company data from the order and formats them as XML-like strings
 *
 * @param order - The order containing customer and company data
 * @returns Object with XML-formatted strings and remaining order data
 */
export function formatOrderComponents(order: ProposedOrder): {
  xmlCustomer: string;
  xmlCompany: string;
  xmlProposedOrder: string;
  customer: OrderCustomer | null;
  company: OrderCompany | null;
} {
  let formattedOrder = { ...order };
  let customer: OrderCustomer | null = null;
  let company: OrderCompany | null = null;

  // Extract customer
  if (formattedOrder?.customer) {
    customer = { ...formattedOrder.customer };
    // Remove customer from order object
    const { customer: _, ...restData } = formattedOrder;
    formattedOrder = restData;
  }

  // Format customer as XML
  const formattedCustomerJson = JSON.stringify(customer, null, 2);
  const xmlCustomer = `
<customer_information>
      ${formattedCustomerJson}
</customer_information>`;

  // Extract company
  if (formattedOrder?.company) {
    company = { ...formattedOrder.company };
    // Remove company from order object
    const { company: _, ...restData } = formattedOrder;
    formattedOrder = restData;
  }

  // Format company as XML
  const formattedCompanyJson = JSON.stringify(company, null, 2);
  const xmlCompany = `
<company_information>
      ${formattedCompanyJson}
</company_information>`;

  // Format the order as XML
  const formattedProposedOrderJson = JSON.stringify(formattedOrder, null, 2);
  const xmlProposedOrder = `
<pending_order_details>
      ${formattedProposedOrderJson}
</pending_order_details>`;

  return {
    xmlCustomer,
    xmlCompany,
    xmlProposedOrder,
    customer,
    company,
  };
}
