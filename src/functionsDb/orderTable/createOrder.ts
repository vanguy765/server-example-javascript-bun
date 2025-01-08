// src/functionsDb/orderTable/createOrder.ts

export const createOrder = (orderData = mockOrderData) => {
  return orderData;
};

const mockOrderData = {
  orderId: '12345',
  customerName: 'John Doe',
  items: [
    { itemId: 'item1', quantity: 2, price: 10.0 },
    { itemId: 'item2', quantity: 1, price: 20.0 },
  ],
  totalAmount: 40.0,
  orderDate: '2023-10-01',
};