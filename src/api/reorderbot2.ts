// =============================================================================
// IMPORTS AND DEPENDENCIES
// =============================================================================
import { createRepository } from "../supabase/generated-repo";
import { createClient } from "@supabase/supabase-js";
import { AuthUser, isAuthError } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";
import { z } from "zod";

// =============================================================================
// GLOBAL CONSTANTS AND CONFIGURATION
// =============================================================================
const DEFAULT_PHONE = "+17787754146";
const DEFAULT_DOMAIN = "acmecleaning.com";
const DEFAULT_TENANT_ID = "f0555d1a-5da7-4d15-b864-a1c6b16458a8";

// =============================================================================
// CONFIGURATION AND INITIALIZATION
// =============================================================================
// Create admin client
const adminSupabaseClient = createClient(
  envConfig.supabase.url,
  envConfig.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// =============================================================================
// TENANT FUNCTIONS
// =============================================================================

async function getTenantIdFromDomain(): Promise<string> {
  // let domain = envConfig.supabase.url.split(".")[0].replace("https://", "");  if (domain === "localhost") {
  //   domain = "acmecleaning.com";
  // }
  // Use the domain from environment or the default for localhost

  const domain = DEFAULT_DOMAIN;
  console.log(`getTenantIdFromDomain: Using domain "${domain}"`);

  try {
    const { data: tenantData, error: tenantError } = await adminSupabaseClient
      .from("tenants")
      .select("*")
      .eq("domain", domain)
      .single();

    if (tenantError) {
      console.error(`Error fetching tenant for domain ${domain}:`, tenantError);
      // Return default tenant ID for error case
      return DEFAULT_TENANT_ID;
    }

    if (!tenantData) {
      console.warn(`No tenant found for domain ${domain}`);
      // Return default tenant ID when no tenant is found
      return DEFAULT_TENANT_ID;
    }

    console.log(
      `getTenantIdFromDomain: Found tenant for domain "${domain}":`,
      JSON.stringify(tenantData, null, 2)
    );

    return tenantData.id;
  } catch (e: any) {
    console.error(`getTenantIdFromDomain Error: ${e.message}`, e);
    // Return default tenant ID for any exceptions
    return DEFAULT_TENANT_ID;
  }
}
