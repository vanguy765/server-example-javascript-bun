/**
 * Utility functions for safely accessing data in the reorderbot application
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase/client";
import { validateSupabaseClient } from "../supabase/client";
import { createRepository } from "../supabase/generated-repo";
import {
  ensureValidSupabaseClient,
  createMockClient,
} from "../supabase/client-utils";
import { Database } from "../supabase/generated.types";

/**
 * Function to safely create a repository instance with fallback mechanisms
 * Will never throw an exception - always returns a functioning repository
 */
export async function getSafeRepository<
  T extends keyof Database["public"]["Tables"]
>(tableName: T) {
  let client: SupabaseClient<Database> = supabaseClient;

  try {
    // Check if the current client is valid
    if (!validateSupabaseClient(client)) {
      console.error(
        `Invalid Supabase client detected when creating repository for ${tableName}`
      );

      try {
        // Try to create a valid client
        client = await ensureValidSupabaseClient(client);
        console.log(
          `Successfully created a new valid client for ${tableName} repository`
        );
      } catch (error) {
        console.error(
          `Failed to create valid client for ${tableName} repository:`,
          error
        );
        // Fall back to mock client as last resort
        client = createMockClient();
      }
    }

    // Create the repository with our validated/fallback client
    return createRepository(client, tableName);
  } catch (error) {
    // This should never happen, but just in case
    console.error(`Unexpected error creating ${tableName} repository:`, error);

    // Return a minimal mock repository that won't crash the application
    return {
      getAll: async () => {
        console.error(
          `Using last-resort mock repository for ${tableName}.getAll()`
        );
        return [];
      },
      getById: async (id: string | number) => {
        console.error(
          `Using last-resort mock repository for ${tableName}.getById(${id})`
        );
        return null;
      },
      create: async (record: any) => {
        console.error(
          `Using last-resort mock repository for ${tableName}.create()`
        );
        return null;
      },
      update: async (id: string | number, updates: any) => {
        console.error(
          `Using last-resort mock repository for ${tableName}.update(${id})`
        );
        return null;
      },
      delete: async (id: string | number) => {
        console.error(
          `Using last-resort mock repository for ${tableName}.delete(${id})`
        );
        return false;
      },
      query: () => {
        console.error(
          `Using last-resort mock repository for ${tableName}.query()`
        );
        return {} as any;
      },
    };
  }
}

/**
 * Function to safely query a table directly
 */
export async function safeQueryTable<
  T extends keyof Database["public"]["Tables"]
>(tableName: T, queryFn: (client: SupabaseClient<Database>) => Promise<any>) {
  try {
    // Check if the current client is valid
    if (!validateSupabaseClient(supabaseClient)) {
      console.error(
        `Invalid Supabase client detected when querying ${tableName}`
      );

      try {
        // Try to create a valid client
        const validClient = await ensureValidSupabaseClient(supabaseClient);
        console.log(
          `Successfully created a new valid client for querying ${tableName}`
        );
        return await queryFn(validClient);
      } catch (error) {
        console.error(
          `Failed to create valid client for querying ${tableName}:`,
          error
        );
        return { data: [], error };
      }
    }

    // Use the existing client
    return await queryFn(supabaseClient);
  } catch (error) {
    console.error(`Unexpected error querying ${tableName}:`, error);
    return { data: [], error };
  }
}
