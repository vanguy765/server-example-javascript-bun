// Export client
export { supabaseClient } from "./client";

// Export tenant functions and routes
export {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  tenantsRoute,
} from "./tenants";

// Export direct API functions (simpler approach without Repository Pattern)
export { directApi as tenantsDirectApi } from "./tenants";

// Re-export types
export type { Tenant } from "./types";

// Re-export schemas and DTOs
export {
  tenantSchema,
  createTenantSchema,
  updateTenantSchema,
} from "./schemas";
export type {
  CreateTenantDTO,
  UpdateTenantDTO,
  TenantFromSchema,
} from "./schemas";

// Export generated enums
// Note: This export might fail if the file doesn't exist yet
// Run 'pnpm gen:schema-types' first to generate the enums file
export * from "./generated.enums";

// Export generated enums (uncomment after generating the enums file)
// export * from "./generated.enums";

// In the future, you can add more exports for other tables and queries here
