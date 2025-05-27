# User and Customer Management Service

This service provides functionality to manage users and customers in a multi-tenant Supabase database with both `auth` and `public` schemas.

## Features

- Check if a user exists by phone number in the `auth.users` table
- Create a user in both `auth.users` and `public.users` tables if none exists
- Create a customer record in `public.customers` linked to the user
- Update existing customer information when provided
- Support for multi-tenancy with tenant-specific user and customer records

## Usage

### Check/Create User and Customer

Use the `checkCreateUserCustomer` function to check if a user exists by phone number, create them if they don't exist, and create/update a linked customer record.

```typescript
import { checkCreateUserCustomer } from "../src/api/db/user-customer-service";

// Example usage
async function example() {
  const result = await checkCreateUserCustomer(
    "+15551234567", // Phone number
    "tenant-uuid", // Tenant ID
    {
      // Optional fields
      email: "user@example.com",
      firstName: "John",
      lastName: "Doe",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA",
      company: "ACME Inc",
      industryId: "industry-uuid",
    }
  );

  if (result) {
    // Result contains user, customer, and creation status
    console.log("User ID:", result.user.id);
    console.log("Customer ID:", result.customer.id);
    console.log("Is New User:", result.isNewUser);
    console.log("Is New Customer:", result.isNewCustomer);
  }
}
```

### Get Customer by Phone Number

Use the `getCustomerByPhone` function to retrieve a customer record by phone number for a specific tenant.

```typescript
import { getCustomerByPhone } from "../src/api/db/user-customer-service";

// Example usage
async function example() {
  const customer = await getCustomerByPhone(
    "+15551234567", // Phone number
    "tenant-uuid" // Tenant ID
  );

  if (customer) {
    console.log("Found customer:", customer);
  } else {
    console.log("Customer not found");
  }
}
```

## Implementation Details

1. First checks if a user exists in `auth.users` by phone number
2. If no user exists, creates one using Supabase Auth Admin API
3. Ensures a corresponding record exists in `public.users`
4. Creates or updates a customer record in `public.customers` linked to the user
5. Returns both user and customer records along with creation status flags

## Requirements

- Supabase project with both `auth` and `public` schemas
- Service requires admin access using the Supabase service role key
- Valid tenant IDs must exist in the `public.tenants` table

## Error Handling

All functions include proper error handling and return `null` when operations fail. Check the logs for detailed error messages.
