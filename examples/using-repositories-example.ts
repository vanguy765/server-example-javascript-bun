/**
 * Example usage of the generated repository patterns for Supabase
 * This example demonstrates how to use the type-safe repository patterns
 * to interact with your Supabase database.
 */

import { repositories } from "../src/supabase/generated-repo";
import {
  ContactMethod,
  InteractionOutcome,
  InteractionPurpose,
  InteractionStatus,
} from "../src/supabase/generated.enums";

async function main() {
  try {
    console.log("🚀 Running repository pattern examples...");

    // Example 1: Working with tenants
    console.log("\n📊 Example 1: Working with tenants");
    await workWithTenants();

    // Example 2: Working with customers and their preferences
    console.log("\n👤 Example 2: Working with customers and preferences");
    await workWithCustomers();

    // Example 3: Working with interactions using enums
    console.log("\n🔄 Example 3: Working with interactions using enums");
    await workWithInteractions();

    // Example 4: Advanced queries
    console.log("\n🔍 Example 4: Advanced queries");
    await runAdvancedQueries();

    console.log("\n✅ All examples completed successfully");
  } catch (error) {
    console.error("❌ Error running examples:", error);
  }
}

/**
 * Example of working with tenant records
 */
async function workWithTenants() {
  const { tenants } = repositories;

  // Count all tenants
  const tenantCount = await tenants.count();
  console.log(`Total tenants: ${tenantCount}`);
  // Create a new tenant
  const newTenant = await tenants.create({
    name: "Example Corp",
    domain: "example.com",
    settings: {
      theme: "light",
      features: ["crm", "inventory", "ordering"],
    },
    is_active: true,
  });
  console.log("Created new tenant:", newTenant);

  // Get the tenant by ID
  const retrievedTenant = await tenants.getById(newTenant.id);
  console.log("Retrieved tenant:", retrievedTenant);

  // Update the tenant
  const updatedTenant = await tenants.update(newTenant.id, {
    settings: {
      theme: "dark",
      features: ["crm", "inventory", "ordering", "reporting"],
    },
  });
  console.log("Updated tenant:", updatedTenant);

  // Check if tenant exists
  const exists = await tenants.exists(newTenant.id);
  console.log(`Tenant exists: ${exists}`);

  // Clean up - delete the tenant
  await tenants.delete(newTenant.id);
  console.log("Deleted tenant");

  // Verify deletion
  const stillExists = await tenants.exists(newTenant.id);
  console.log(`Tenant still exists: ${stillExists}`);
}

/**
 * Example of working with customers and their preferences
 */
async function workWithCustomers() {
  const { customers, customerPreferences } = repositories;
  // Create a tenant first (for foreign key constraint)
  const tenant = await repositories.tenants.create({
    name: "Customer Demo Tenant",
    is_active: true,
  });

  // Create a new customer
  const newCustomer = await customers.create({
    tenant_id: tenant.id,
    first_name: "Jane",
    last_name: "Doe",
    email: "jane.doe@example.com",
    phone: "+1-555-987-6543",
    company: "Acme Inc.",
    is_active: true,
  });
  console.log("Created new customer:", newCustomer);
  // Add customer preferences
  const preferences = await customerPreferences.create({
    customer_id: newCustomer.id,
    contact_by_enum: ContactMethod.EMAIL,
    personal: {
      preferred_language: "en",
      preferred_time: "10:00-14:00",
    },
    business: {
      notifications: true,
      marketing: false,
      product_updates: true,
    },
  });
  console.log("Created customer preferences:", preferences);

  // Retrieve all preferences for a customer
  const customerPrefs = await customerPreferences.getBy(
    "customer_id",
    newCustomer.id
  );
  console.log("Customer preferences:", customerPrefs);

  // Clean up
  await customerPreferences.delete(preferences.id);
  await customers.delete(newCustomer.id);
  await repositories.tenants.delete(tenant.id);
  console.log("Cleaned up customer data");
}

/**
 * Example of working with interactions using enum types
 */
async function workWithInteractions() {
  const { callLogs } = repositories;

  // Create a tenant first
  const tenant = await repositories.tenants.create({
    name: "Interactions Demo Tenant",
    is_active: true,
  });

  // Create a customer
  const customer = await repositories.customers.create({
    tenant_id: tenant.id,
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@example.com",
    is_active: true,
  });

  // Create an agent
  const agent = await repositories.agents.create({
    tenant_id: tenant.id,
    name: "Support Agent",
    email: "agent@example.com",
    is_active: true,
  });

  // Create a call log using enum values
  const callLog = await callLogs.create({
    tenant_id: tenant.id,
    customer_id: customer.id,
    agent_id: agent.id,
    purpose: InteractionPurpose.SALES,
    status: InteractionStatus.COMPLETED,
    outcome: InteractionOutcome.SUCCESSFUL,
    notes: "Successful sales call with the customer",
    call_date: new Date().toISOString(),
    duration: 300, // 5 minutes
  });
  console.log("Created call log:", callLog);

  // Get call logs by outcome using enum
  const successfulCalls = await callLogs.getBy(
    "outcome",
    InteractionOutcome.SUCCESSFUL
  );
  console.log(`Found ${successfulCalls.length} successful calls`);

  // Clean up
  await callLogs.delete(callLog.id);
  await repositories.agents.delete(agent.id);
  await repositories.customers.delete(customer.id);
  await repositories.tenants.delete(tenant.id);
  console.log("Cleaned up call log data");
}

/**
 * Example of advanced queries using the query builder
 */
async function runAdvancedQueries() {
  // Create a tenant for testing
  const tenant = await repositories.tenants.create({
    name: "Advanced Query Demo",
    is_active: true,
  });

  // Create multiple products for this tenant
  const products = await repositories.products.createMany([
    {
      tenant_id: tenant.id,
      name: "Product A",
      description: "First test product",
      price: 19.99,
      is_active: true,
    },
    {
      tenant_id: tenant.id,
      name: "Product B",
      description: "Second test product",
      price: 29.99,
      is_active: true,
    },
    {
      tenant_id: tenant.id,
      name: "Product C",
      description: "Third test product",
      price: 39.99,
      is_active: false,
    },
  ]);
  console.log(`Created ${products.length} test products`);

  // Use the query builder for a complex query
  const { data: activeExpensiveProducts } = await repositories.products
    .query()
    .eq("tenant_id", tenant.id)
    .eq("is_active", true)
    .gt("price", 20.0)
    .order("price", { ascending: false });

  console.log(
    "Active expensive products (price > $20):",
    activeExpensiveProducts
  );

  // Get paginated results
  const paginatedResult = await repositories.products.getPaginated(1, 2);
  console.log("Paginated products:", paginatedResult);

  // Update multiple records that match a condition
  await repositories.products.updateMany("tenant_id", tenant.id, {
    is_active: true,
  });
  console.log("Updated all products to active status");

  // Clean up - delete all products for this tenant
  await repositories.products.deleteMany("tenant_id", tenant.id);
  await repositories.tenants.delete(tenant.id);
  console.log("Cleaned up all test data");
}

// Run the examples
main();
