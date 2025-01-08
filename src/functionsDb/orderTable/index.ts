// src/functionsDb/orderTable/
// ├── createOrder.ts
// ├── getOrderLineItems.ts
// ├── getCustomerOrders.ts
// ├── getCustomerLastOrder.ts
// └── updateOrder.ts

import { createOrder } from './createOrder';
import { getOrderLineItems } from './getOrderLineItems';
import { getLastOrder } from './getLastOrder';
import { updateOrder } from './updateOrder';

export const orderTable = {
  createOrder,
  getOrderLineItems,
  getLastOrder,
  updateOrder,
};