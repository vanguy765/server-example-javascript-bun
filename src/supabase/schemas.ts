import { z } from "zod";

/**
 * Zod schemas for validation
 * These schemas define validation rules for data
 */

// Tenant schema for validation
export const tenantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  contact_email: z.string().email("Invalid email format").optional(),
  contact_phone: z.string().optional(),
  // Add additional field validations as needed
});

// Schema for creating a new tenant (omit auto-generated fields)
export const createTenantSchema = tenantSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Schema for updating an existing tenant (all fields optional)
export const updateTenantSchema = createTenantSchema.partial();

// Generate TypeScript types from Zod schemas
export type TenantFromSchema = z.infer<typeof tenantSchema>;
export type CreateTenantDTO = z.infer<typeof createTenantSchema>;
export type UpdateTenantDTO = z.infer<typeof updateTenantSchema>;

// Export a dummy value to ensure this is treated as a module
const schemas = {};
export default schemas;
