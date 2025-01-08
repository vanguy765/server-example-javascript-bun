// src/functionsDb/orderTable/updateOrder.ts

export const updateOrder = (orderData = mockUpdateOrderData) => {
  return orderData;
};

const mockUpdateOrderData = {
  orderId: '12345',
  customerName: 'John Doe',
  items: [
    { itemId: 'item1', quantity: 3, price: 10.0 },
    { itemId: 'item2', quantity: 1, price: 20.0 },
  ],
  totalAmount: 50.0,
  orderDate: '2023-10-01',
};