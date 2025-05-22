import { supabaseClient } from "./client";
import { Hono } from "hono";
import { Bindings } from "../types/hono.types";
import { zValidator } from "@hono/zod-validator";
import type { Tenant } from "./types";
import {
  tenantSchema,
  createTenantSchema,
  updateTenantSchema,
  type CreateTenantDTO,
  type UpdateTenantDTO,
} from "./schemas";

const app = new Hono<{ Bindings: Bindings }>();

/**
 * Direct Supabase API usage
 *
 * This section demonstrates direct usage of the Supabase client
 * without the additional abstraction of the Repository Pattern.
 * It's simpler but has fewer safeguards.
 */
export const directApi = {
  // Get all tenants directly
  getAllTenants: async () => {
    return await supabaseClient.from("tenants").select("*");
  },

  // Get tenant by ID directly
  getTenantById: async (id: string) => {
    return await supabaseClient
      .from("tenants")
      .select("*")
      .eq("id", id)
      .single();
  },

  // Create tenant directly
  createTenant: async (
    tenant: Omit<Tenant, "id" | "created_at" | "updated_at">
  ) => {
    return await supabaseClient
      .from("tenants")
      .insert(tenant)
      .select()
      .single();
  },

  // Update tenant directly
  updateTenant: async (
    id: string,
    tenant: Partial<Omit<Tenant, "id" | "created_at" | "updated_at">>
  ) => {
    return await supabaseClient
      .from("tenants")
      .update(tenant)
      .eq("id", id)
      .select()
      .single();
  },

  // Delete tenant directly
  deleteTenant: async (id: string) => {
    return await supabaseClient.from("tenants").delete().eq("id", id);
  },
};

/**
 * Repository Pattern functions for tenants
 *
 * These functions add type safety, validation, and consistent error handling
 * on top of the direct Supabase API calls.
 */

// Helper function to get all tenants
export async function getAllTenants(): Promise<Tenant[]> {
  const { data, error } = await supabaseClient.from("tenants").select("*");

  if (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }

  return data as Tenant[];
}

// Get tenant by ID
export async function getTenantById(id: string): Promise<Tenant | null> {
  const { data, error } = await supabaseClient
    .from("tenants")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching tenant by ID:", error);
    throw error;
  }

  return data as Tenant;
}

// Create a new tenant with validation
export async function createTenant(tenant: CreateTenantDTO): Promise<Tenant> {
  // Validate with Zod (will throw if invalid)
  createTenantSchema.parse(tenant);

  const { data, error } = await supabaseClient
    .from("tenants")
    .insert(tenant)
    .select()
    .single();

  if (error) {
    console.error("Error creating tenant:", error);
    throw error;
  }

  return data as Tenant;
}

// Update an existing tenant with validation
export async function updateTenant(
  id: string,
  tenant: UpdateTenantDTO
): Promise<Tenant> {
  // Validate with Zod (will throw if invalid)
  updateTenantSchema.parse(tenant);

  const { data, error } = await supabaseClient
    .from("tenants")
    .update(tenant)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tenant:", error);
    throw error;
  }

  return data as Tenant;
}

// Delete a tenant by ID
export async function deleteTenant(id: string): Promise<void> {
  const { error } = await supabaseClient.from("tenants").delete().eq("id", id);

  if (error) {
    console.error("Error deleting tenant:", error);
    throw error;
  }
}

/**
 * API routes for tenants
 */

// Get all tenants
app.get("/", async (c) => {
  try {
    const tenants = await getAllTenants();
    return c.json({ tenants }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get tenant by ID
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const tenant = await getTenantById(id);

    if (!tenant) {
      return c.json({ error: "Tenant not found" }, 404);
    }

    return c.json({ tenant }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Create tenant with validation
app.post("/", zValidator("json", createTenantSchema), async (c) => {
  try {
    const body = await c.req.json();
    const tenant = await createTenant(body);
    return c.json({ tenant }, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
});

// Update tenant with validation
app.patch("/:id", zValidator("json", updateTenantSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const tenant = await updateTenant(id, body);
    return c.json({ tenant }, 200);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
});

// Delete tenant
app.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await deleteTenant(id);
    return c.json({ message: "Tenant deleted successfully" }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export { app as tenantsRoute };
