import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";
import type { Database } from "./generated.types"; // Import Database type
import { createMockClient } from "./client-utils";

/**
 * Function to validate Supabase client
 * Returns true if client is properly initialized with required methods
 */
export function validateSupabaseClient(
  client: any
): client is SupabaseClient<Database> {
  if (!client) {
    console.error("ERROR: Supabase client is undefined or null");
    return false;
  }

  if (typeof client.from !== "function") {
    console.error("ERROR: Supabase client is missing the 'from' method");
    console.error("Client type:", typeof client);
    console.error("Client methods available:", Object.keys(client).join(", "));
    return false;
  }

  return true;
}

// Create a properly typed Supabase client instance
export let supabaseClient: SupabaseClient<Database>;
export let adminSupabaseClient: SupabaseClient<Database>;

try {
  // Initialize main client
  supabaseClient = createClient<Database>(
    envConfig.supabase.url,
    envConfig.supabase.key
  );

  // Validate the client
  if (!validateSupabaseClient(supabaseClient)) {
    console.error("Failed to initialize Supabase client properly");
    // Initialize with a proper mock client to prevent crashes
    supabaseClient = createMockClient();
  } else {
    // Log successful initialization
    console.log("Supabase client initialized successfully.");
  }

  // Initialize admin client
  adminSupabaseClient = createClient<Database>(
    envConfig.supabase.url,
    envConfig.supabase.serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // Validate the admin client
  if (!validateSupabaseClient(adminSupabaseClient)) {
    console.error("Failed to initialize Admin Supabase client properly");
    adminSupabaseClient = createMockClient();
  } else {
    console.log("Admin Supabase client initialized successfully.");
  }
} catch (error) {
  console.error("Error initializing Supabase clients:", error);

  // Initialize with proper mock clients to prevent crashes
  supabaseClient = createMockClient();
  adminSupabaseClient = createMockClient();

  // Re-throw if in development to make the error obvious
  if (process.env.NODE_ENV === "development") {
    console.error("CRITICAL: Supabase client initialization failed completely");
  }
}
