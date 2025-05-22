/**
 * @deprecated This file is deprecated. Please use the modules in src/supabase/ instead.
 *
 * The Supabase functionality has been moved to a more robust Repository Pattern
 * implementation in the src/supabase directory. This file is kept for backward
 * compatibility but will be removed in a future update.
 *
 * See the docs/examples/repository-pattern.md file for documentation on the new approach.
 */

import { Hono } from "hono";
import { Bindings } from "../types/hono.types";
import {
  getAllTenants as getTenantsFromRepo,
  supabaseClient,
} from "../supabase";

const app = new Hono<{ Bindings: Bindings }>();

// Helper function to get all tenants (for backward compatibility)
export async function getAllTenants() {
  console.warn(
    "WARNING: Using deprecated getAllTenants function. Please import from src/supabase instead."
  );
  return await getTenantsFromRepo();
}

// API endpoint to get all tenants
app.get("/tenants", async (c) => {
  try {
    const tenants = await getAllTenants();
    return c.json({ tenants }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// For backward compatibility
export { supabaseClient };
export { app as supabaseRoute };
