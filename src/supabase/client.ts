import { createClient } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";

// Create a Supabase client instance
export const supabaseClient = createClient(
  envConfig.supabase.url,
  envConfig.supabase.key
);
