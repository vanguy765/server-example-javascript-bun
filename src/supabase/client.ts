import { createClient } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";
import type { Database } from "./generated.types"; // Import Database type

// Create a Supabase client instance
export const supabaseClient = createClient<Database>( // Use Database type
  envConfig.supabase.url,
  envConfig.supabase.key
);

// Create an admin client instance with service role key
export const adminSupabaseClient = createClient<Database>( // Use Database type
  envConfig.supabase.url,
  envConfig.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
