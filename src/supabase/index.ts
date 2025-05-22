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

// In the future, you can add more exports for other tables and queries here
