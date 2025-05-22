import { createClient } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";
import { Hono } from "hono";
import { Bindings } from "../types/hono.types";

const app = new Hono<{ Bindings: Bindings }>();

// Create a Supabase client instance
export const supabaseClient = createClient(
  envConfig.supabase.url,
  envConfig.supabase.key
);

// Helper function to get all tenants
export async function getAllTenants() {
  const { data, error } = await supabaseClient.from("tenants").select("*");

  if (error) {
    console.error("Error fetching tenants:", error);
    throw error;
  }

  return data;
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

export { app as supabaseRoute };
