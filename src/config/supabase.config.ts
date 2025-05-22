/**
 * Supabase Configuration
 * This file contains the configuration for Supabase client.
 */

export const supabaseConfig = {
  apiUrl: "http://127.0.0.1:54321",
  graphqlUrl: "http://127.0.0.1:54321/graphql/v1",
  storageUrl: "http://127.0.0.1:54321/storage/v1/s3",
  dbUrl: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  studioUrl: "http://127.0.0.1:54323",
  inbucketUrl: "http://127.0.0.1:54324",
  jwtSecret: "super-secret-jwt-token-with-at-least-32-characters-long",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
};

/**
 * Helper function to get Supabase credentials
 */
export function getSupabaseCredentials() {
  return {
    url: supabaseConfig.apiUrl,
    key: supabaseConfig.anonKey,
  };
}

/**
 * Helper function to get database connection string
 */
export function getDatabaseUrl() {
  return supabaseConfig.dbUrl;
}
