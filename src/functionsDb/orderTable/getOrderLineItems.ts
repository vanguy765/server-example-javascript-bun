// src/functionsDb/orderTable/getOrderLineItems.ts

export const getOrderLineItems = (orderId: string) => {
  return mockOrderLineItems;
};

export const mockOrderLineItems = {
  orderId: '12345',
  items: [
    { itemId: 'item1', quantity: 2, price: 10.0 },
    { itemId: 'item2', quantity: 1, price: 20.0 },
    { itemId: 'item3', quantity: 1, price: 15.0 },
    { itemId: 'item4', quantity: 3, price: 5.0 },
  ],
};