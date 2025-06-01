/**
 * Utility functions for handling Supabase client errors
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./generated.types";
import { createClient } from "@supabase/supabase-js";
import { envConfig } from "../config/env.config";

/**
 * Safely reinitializes a Supabase client if the provided one isn't valid
 */
export async function ensureValidSupabaseClient(
  client: any
): Promise<SupabaseClient<Database>> {
  // Check if the client is valid
  if (!client || typeof client.from !== "function") {
    console.error(
      "Invalid Supabase client detected. Attempting to create a new one..."
    );

    try {
      // Create a new client
      const newClient = createClient<Database>(
        envConfig.supabase.url,
        envConfig.supabase.key
      );

      // Test the new client
      const { data, error } = await newClient
        .from("_health_check")
        .select("*")
        .maybeSingle();

      if (error) {
        console.error("Error testing new Supabase client:", error);
        throw error;
      }

      console.log("Successfully created and tested a new Supabase client");
      return newClient;
    } catch (error) {
      console.error("Failed to create a new Supabase client:", error);
      throw new Error(
        "Failed to initialize Supabase client: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  return client;
}

/**
 * Creates a mock client that safely handles operations when a real client fails
 */
export function createMockClient(): SupabaseClient<Database> {
  console.warn(
    "Creating mock Supabase client - operations will not affect real database"
  );

  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        order: () => ({
          limit: () => ({
            then: () => Promise.resolve({ data: [], error: null }),
            data: [],
            error: null,
          }),
          then: () => Promise.resolve({ data: [], error: null }),
          data: [],
          error: null,
        }),
        eq: () => ({
          single: () => ({
            then: () => Promise.resolve({ data: null, error: null }),
            data: null,
            error: null,
          }),
          then: () => Promise.resolve({ data: [], error: null }),
          data: [],
          error: null,
        }),
        limit: () => ({
          then: () => Promise.resolve({ data: [], error: null }),
          data: [],
          error: null,
        }),
        contains: () => ({
          then: () => Promise.resolve({ data: [], error: null }),
          data: [],
          error: null,
        }),
        then: () => Promise.resolve({ data: [], error: null }),
        data: [],
        error: null,
      }),
      insert: () => ({
        select: () => ({
          single: () => ({
            then: () => Promise.resolve({ data: null, error: null }),
            data: null,
            error: null,
          }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({
              then: () => Promise.resolve({ data: null, error: null }),
              data: null,
              error: null,
            }),
          }),
        }),
      }),
      delete: () => ({
        eq: () => ({
          then: () => Promise.resolve({ error: null }),
          error: null,
        }),
      }),
    }),
  } as unknown as SupabaseClient<Database>;
}
