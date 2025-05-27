// examples/user-customer-service-example.ts
import {
  checkCreateUserCustomer,
  getCustomerByPhone,
} from "../src/api/db/user-customer-service";

async function demonstrateUserCustomerService() {
  try {
    // Example tenant ID - this should be a valid UUID from your tenants table
    const tenantId = "12345678-1234-1234-1234-123456789012";

    // Example 1: Check if a user exists by phone, create if not, and create/update customer
    console.log("Example 1: Check, create user and customer if needed");
    const result = await checkCreateUserCustomer("+15551234567", tenantId, {
      email: "john.doe@example.com",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA",
      company: "ACME Inc",
    });

    if (result) {
      console.log("User ID:", result.user.id);
      console.log("Customer ID:", result.customer.id);
      console.log("Is New User:", result.isNewUser);
      console.log("Is New Customer:", result.isNewCustomer);
    } else {
      console.log("Failed to check/create user and customer");
    }

    // Example 2: Get customer by phone number
    console.log("\nExample 2: Get customer by phone number");
    const customer = await getCustomerByPhone("+15551234567", tenantId);

    if (customer) {
      console.log("Found customer:", {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`,
        phone: customer.phone,
      });
    } else {
      console.log("Customer not found by phone number");
    }
  } catch (error) {
    console.error("Error in demonstration:", error);
  }
}

// Run the demonstration
demonstrateUserCustomerService()
  .then(() => {
    console.log("Demonstration completed");
  })
  .catch((err) => {
    console.error("Demonstration failed:", err);
  });
