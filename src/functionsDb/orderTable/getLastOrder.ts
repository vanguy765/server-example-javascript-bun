 // src/functionsDb/orderTable/getCustomerOrders.ts 

export const getLastOrder = (customerId: string) => {
  return mockLastOrder;
}

const mockLastOrder = {
    customerID: "123",
    orderID: "789",
    orderDate: "2024-01-20",
    items: [
      {
          id: "12",
          name: "Toilet Paper",
          size: "12 rolls 2 ply",
          quantity: "2"
      },
      {
          id: "21",
          name: "Soap",
          size: "6 bars",
          quantity: "3"
      }
    ]
  };