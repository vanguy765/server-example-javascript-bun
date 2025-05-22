/**
 * Example demonstrating how to use the direct Supabase API approach
 * This approach is simpler but has less type safety and validation compared to the Repository Pattern
 */
import {
  tenantsDirectApi,
  supabaseClient,
  type Tenant,
} from "../../src/supabase";

/**
 * Direct API Usage Examples
 *
 * This approach uses the Supabase client more directly with minimal abstractions.
 * You get the full Supabase response with both data and error properties.
 */

// Example: Fetching all tenants with direct API
async function listAllTenantsDirectly() {
  const { data, error } = await tenantsDirectApi.getAllTenants();

  if (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }

  console.log("All tenants:", data);
  return data as Tenant[];
}

// Example: Fetching a single tenant with direct API
async function getSingleTenantDirectly(id: string) {
  const { data, error } = await tenantsDirectApi.getTenantById(id);

  if (error) {
    // Check if it's a not found error
    if (error.code === "PGRST116") {
      console.log(`Tenant with ID ${id} not found`);
      return null;
    }
    console.error(`Error fetching tenant ${id}:`, error);
    throw error;
  }

  console.log("Found tenant:", data);
  return data as Tenant;
}

// Example: Creating a new tenant with direct API
async function createNewTenantDirectly(
  tenant: Omit<Tenant, "id" | "created_at" | "updated_at">
) {
  // No automatic validation here - you need to validate manually if desired
  const { data, error } = await tenantsDirectApi.createTenant(tenant);

  if (error) {
    console.error("Error creating tenant:", error);
    throw error;
  }

  console.log("Created tenant:", data);
  return data as Tenant;
}

// Example: Using raw Supabase client without any abstractions
async function useRawSupabaseClient() {
  // Direct table access
  const { data: tenants, error } = await supabaseClient
    .from("tenants")
    .select("id, name, description")
    .order("name", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return tenants as Pick<Tenant, "id" | "name" | "description">[];
}

// Example: Advanced query with joins
async function advancedQuery() {
  // Assuming you have a users table related to tenants
  const { data, error } = await supabaseClient
    .from("tenants")
    .select(
      `
      id, 
      name, 
      description,
      users:users(id, email, name)
    `
    )
    .eq("status", "active");

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return data;
}

/**
 * Comparison between approaches:
 *
 * 1. Direct API (tenantsDirectApi):
 *    - Simpler with less abstraction
 *    - Returns Supabase response format { data, error }
 *    - You handle errors manually each time
 *    - Less code overall
 *    - No built-in validation
 *
 * 2. Repository Pattern (getAllTenants, etc.):
 *    - More abstraction and consistency
 *    - Returns just the data (errors are thrown)
 *    - Consistent error handling
 *    - Built-in validation with Zod
 *    - Type safety throughout
 *
 * 3. Raw Client (supabaseClient):
 *    - Maximum flexibility
 *    - Direct access to all Supabase features
 *    - No abstraction or safeguards
 *    - Need to add your own types
 */
