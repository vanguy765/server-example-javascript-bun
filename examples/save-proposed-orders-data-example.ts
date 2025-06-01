// filepath: c:\Users\3900X\Code\vapiordie3\vapiordie3\examples\save-proposed-orders-data-example.ts
import { createClient } from "@supabase/supabase-js";
import { Database } from "../src/supabase/generated.types";
import {
  saveProductSpecials,
  saveCustomerPreferences,
  saveCustomerLastOrder,
} from "../src/supabase/save-proposed-orders-data";

// Example usage of the functions to save data to proposed_orders_data table

async function demonstrateSavingProposedOrdersData() {
  // Initialize your Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_KEY || "";
  const client = createClient<Database>(supabaseUrl, supabaseKey);

  // Mock data for the example
  const typedCallResponse = {
    id: "123456",
    // other call data would be here
  };

  const customerId = "cust_123";
  const tenantId = "tenant_456";

  // Example data
  const productSpecialsResult = {
    items: [
      { id: "prod_1", name: "Special Product 1", price: 19.99, discount: 0.15 },
      { id: "prod_2", name: "Special Product 2", price: 29.99, discount: 0.1 },
    ],
    validUntil: "2025-06-15",
  };

  const customerPreferencesResult = {
    favorites: [
      {
        id: "prod_3",
        name: "Favorite Product 1",
        lastOrderedDate: "2025-05-15",
      },
      {
        id: "prod_4",
        name: "Favorite Product 2",
        lastOrderedDate: "2025-05-20",
      },
    ],
    preferredCategories: ["category_1", "category_3"],
  };

  const fetchCustomerLastOrder = {
    orderId: "order_789",
    orderDate: "2025-05-25",
    items: [
      {
        id: "prod_5",
        name: "Previous Order Item 1",
        quantity: 2,
        price: 24.99,
      },
      {
        id: "prod_6",
        name: "Previous Order Item 2",
        quantity: 1,
        price: 39.99,
      },
    ],
    total: 89.97,
  };

  try {
    // Save product specials data
    const savedSpecials = await saveProductSpecials(
      client,
      typedCallResponse.id,
      customerId,
      tenantId,
      productSpecialsResult
    );
    console.log("Saved product specials:", savedSpecials);

    // Save customer preferences data
    const savedPreferences = await saveCustomerPreferences(
      client,
      typedCallResponse.id,
      customerId,
      tenantId,
      customerPreferencesResult
    );
    console.log("Saved customer preferences:", savedPreferences);

    // Save customer's last order data
    const savedLastOrder = await saveCustomerLastOrder(
      client,
      typedCallResponse.id,
      customerId,
      tenantId,
      fetchCustomerLastOrder
    );
    console.log("Saved customer last order:", savedLastOrder);

    console.log("All data successfully saved to proposed_orders_data table");
  } catch (error) {
    console.error("Error saving data:", error);
  }
}

// Execute the function
// demonstrateSavingProposedOrdersData();

export { demonstrateSavingProposedOrdersData };
