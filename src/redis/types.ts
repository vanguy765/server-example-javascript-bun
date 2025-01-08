// types.ts
export interface LastOrder {
    customerID: string;
    orderID: string;
    orderDate: string;
    items: Array<{
      id: string;
      name: string;
      size: string;
      quantity: string;
    }>;
    customerName: string;
    customerCell: string;
  }
  
  export interface Company {
    companyID: string;
    companyName: string;
    companyPhone: string;
  }
  
  export interface OrderState {
    lastOrder: LastOrder;
    company: Company;
    currentItems: LastOrder['items'];
  }