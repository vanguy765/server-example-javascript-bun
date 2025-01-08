// src/functionsDb/customerTable/getCustomer.ts

export const getCustomer = (customerId: string) => {
    return mockCustomer;
  }
  
  const mockCustomer = {
      ID: "123",
      name: "John Smith",
      cell: "+17787754146"
    };