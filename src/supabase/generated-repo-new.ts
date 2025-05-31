// Auto-generated repository functions from Supabase schema
// Generated on: 2025-05-22T12:00:00.000Z

import { supabaseClient } from "./client";
import type { Database } from "./generated.types";

/**
 * Repository factory - creates type-safe repository functions for any table
 */
export function createRepository<
  T extends keyof Database["public"]["Tables"],
  Row = Database["public"]["Tables"][T]["Row"],
  Insert = Database["public"]["Tables"][T]["Insert"],
  Update = Database["public"]["Tables"][T]["Update"]
>(tableName: T) {
  return {
    /**
     * Get all records from a table
     * @returns An array of records
     */
    getAll: async () => {
      const { data, error } = await supabaseClient.from(tableName).select("*");
      if (error) throw error;
      return data as Row[];
    },

    /**
     * Get a record by id
     * @param id The record id
     * @returns The record or null if not found
     */
    getById: async (id: string | number) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .select("*")
        .eq("id", id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data as Row | null;
    },

    /**
     * Create a new record
     * @param record The record data
     * @returns The created record
     */
    create: async (record: Insert) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert(record)
        .select()
        .single();

      if (error) throw error;
      return data as Row;
    },

    /**
     * Create multiple records at once
     * @param records The array of record data to insert
     * @returns The created records
     */
    createMany: async (records: Insert[]) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert(records)
        .select();

      if (error) throw error;
      return data as Row[];
    },

    /**
     * Update a record
     * @param id The record id
     * @param record The record data to update
     * @returns The updated record
     */
    update: async (id: string | number, record: Update) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .update(record)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Row;
    },

    /**
     * Update multiple records that match a condition
     * @param column The column to filter on
     * @param value The value to filter by
     * @param record The record data to update
     * @returns The updated records
     */
    updateMany: async <V>(column: keyof Row, value: V, record: Update) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .update(record)
        .eq(column as string, value)
        .select();

      if (error) throw error;
      return data as Row[];
    },

    /**
     * Delete a record
     * @param id The record id
     */
    delete: async (id: string | number) => {
      const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },

    /**
     * Delete multiple records that match a condition
     * @param column The column to filter on
     * @param value The value to filter by
     */
    deleteMany: async <V>(column: keyof Row, value: V) => {
      const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq(column as string, value);

      if (error) throw error;
    },

    /**
     * Get records by a filter
     * @param column The column to filter on
     * @param value The value to filter by
     * @returns An array of records matching the filter
     */
    getBy: async <V>(column: keyof Row, value: V) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .select("*")
        .eq(column as string, value);

      if (error) throw error;
      return data as Row[];
    },

    /**
     * Get a single record by a specific column value
     * Similar to getBy, but returns a single record using .single() and handles not found cases
     *
     * @param column The column name to filter on (string-based for flexibility with dynamic columns)
     * @param value The value to filter by
     * @returns A single record matching the filter or null if not found
     * @throws Error if the specified column doesn't exist in the table definition
     */
    getByColumn: async (column: string, value: any) => {
      // Attempt to validate if column exists in table definition
      // @ts-ignore - Accessing internal schema information
      const columns = (supabaseClient as any).schema?.public?.Tables?.[
        tableName
      ]?.columns;
      if (columns && !columns[column]) {
        throw new Error(
          `Column "${column}" does not exist on table "${tableName}"`
        );
      }

      const { data, error } = await supabaseClient
        .from(tableName)
        .select("*")
        .eq(column, value)
        .single();

      // Handle not found case with null return instead of exception
      if (error && error.code !== "PGRST116") throw error;
      return data as Row | null;
    },

    /**
     * Create a filter builder for more complex queries
     * @returns A PostgREST filter builder
     */
    query: () => {
      return supabaseClient.from(tableName).select();
    },

    /**
     * Count records in the table
     * @returns The count of records
     */
    count: async () => {
      const { count, error } = await supabaseClient
        .from(tableName)
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    },

    /**
     * Check if a record exists
     * @param id The record id
     * @returns True if the record exists
     */
    exists: async (id: string | number) => {
      const { count, error } = await supabaseClient
        .from(tableName)
        .select("*", { count: "exact", head: true })
        .eq("id", id);

      if (error) throw error;
      return (count || 0) > 0;
    },

    /**
     * Upsert a record (insert if not exists, update if exists)
     * @param record The record data
     * @returns The upserted record
     */
    upsert: async (record: Insert) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .upsert(record)
        .select()
        .single();

      if (error) throw error;
      return data as Row;
    },

    /**
     * Get records with pagination
     * @param page The page number (1-based)
     * @param pageSize The page size
     * @returns Paginated records
     */
    getPaginated: async (page: number = 1, pageSize: number = 10) => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabaseClient
        .from(tableName)
        .select("*", { count: "exact" })
        .range(start, end);

      if (error) throw error;
      return {
        data: data as Row[],
        pagination: {
          page,
          pageSize,
          total: count || 0,
          totalPages: count ? Math.ceil(count / pageSize) : 0,
        },
      };
    },
  };
}

// Pre-generated repositories
export const repositories = {
  accessPhones: createRepository("access_phones"),
  agents: createRepository("agents"),
  apiKeys: createRepository("api_keys"),
  auditLogs: createRepository("audit_logs"),
  callLogs: createRepository("call_logs"),
  // @ts-ignore - Type 'customer_interactions' may not be defined in the Database type yet
  customerInteractions: createRepository("customer_interactions" as any),
  customerPreferences: createRepository("customer_preferences"),
  customers: createRepository("customers"),
  industries: createRepository("industries"),
  ipAllowlist: createRepository("ip_allowlist"),
  // @ts-ignore - Type 'messages' may not be defined in the Database type yet
  messages: createRepository("messages" as any),
  orderItems: createRepository("order_items"),
  orders: createRepository("orders"),
  productCategories: createRepository("product_categories"),
  productSpecials: createRepository("product_specials"),
  productTypes: createRepository("product_types"),
  products: createRepository("products"),
  proposedOrders: createRepository("proposed_orders"),
  roles: createRepository("roles"),
  tenants: createRepository("tenants"),
  userPreferences: createRepository("user_preferences"),
  userRoles: createRepository("user_roles"),
  users: createRepository("users"),
};
