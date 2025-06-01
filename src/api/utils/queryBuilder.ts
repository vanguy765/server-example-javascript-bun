/**
 * Database Query Builder Utility
 *
 * This module provides a dynamic query builder for Supabase that supports:
 * - Column selection
 * - Filtering with different operators
 * - Relationships/joins with custom column selection
 * - Custom JSON key naming for nested objects
 * - Sorting
 * - Pagination with limits
 * - Single record or array responses
 */

import { supabaseClient } from "../../supabase/client";
import type { Database } from "../../supabase/generated.types";
import { safeQueryTable } from "../db-utils";

/**
 * Interface for defining relationship options in queries
 */
export interface RelationshipOption {
  table: string;
  columns?: string[];
  jsonKey?: string;
}

/**
 * Interface for defining sorting options in queries
 */
export interface SortingOption {
  column: string;
  direction?: string; // "asc" or "desc"
}

/**
 * Interface for defining filter options in queries
 */
export interface Filter {
  column: string;
  operator: string;
  value: any;
}

/**
 * Options for building a dynamic query
 */
export interface BuildDynamicQueryOptions {
  columns?: string[]; // Columns to select
  filters?: Filter[]; // Filters to apply
  relationships?: (string | RelationshipOption)[]; // Related tables to join
  jsonKey?: string | null; // Optional JSON key for the result
  sorting?: SortingOption[]; // Sorting options
  limit?: number | null; // Limit results (pagination)
  single?: boolean; // Return a single record
}

/**
 * Response from a dynamic query
 */
export interface BuildDynamicQueryResponse<T = any> {
  data: T | null;
  error: any;
}

/**
 * Builds and executes a dynamic query against a Supabase table
 *
 * @param tableName - The name of the table to query
 * @param options - Query options (columns, filters, relationships, etc.)
 * @returns A promise with the query results
 */
export const buildDynamicQuery = async <
  TName extends keyof Database["public"]["Tables"],
  TResponseData = any
>(
  tableName: TName,
  options: BuildDynamicQueryOptions = {}
): Promise<BuildDynamicQueryResponse<TResponseData>> => {
  // Destructure and provide defaults for all options
  const {
    columns = ["*"],
    filters = [],
    relationships = [],
    jsonKey = null,
    sorting = [],
    limit = null,
    single = false,
  } = options;

  // Build the SELECT clause
  const columnsString = columns.join(", ");
  let selectString = columnsString;

  // Handle relationships (joins)
  if (relationships.length > 0) {
    const relationshipStrings = relationships.map((rel) => {
      if (typeof rel === "string") {
        // Simple relationship with all columns
        return `${rel}(*)`;
      } else {
        // Complex relationship with specific columns
        const { table, columns: relColumns = ["*"], jsonKey: relJsonKey } = rel;
        if (relJsonKey) {
          // With custom JSON key
          return `${relJsonKey}:${table}(${relColumns.join(", ")})`;
        } else {
          // Without custom JSON key
          return `${table}(${relColumns.join(", ")})`;
        }
      }
    });

    // Combine main table columns with relationships
    selectString = [columnsString, ...relationshipStrings].join(", ");
  }

  // Apply a custom JSON key to the entire result if specified
  const finalSelectString = jsonKey
    ? `${jsonKey}:${selectString}`
    : selectString;

  // Use safeQueryTable to ensure robust client handling
  return await safeQueryTable(tableName, async (client) => {
    // Start building the query with the SELECT clause
    let query = client
      .from(tableName)
      .select<string, TResponseData>(finalSelectString);

    // Apply all filters
    if (filters.length > 0) {
      filters.forEach((filter) => {
        const { column, operator, value } = filter;
        // Use dynamic operator methods (eq, neq, gt, lt, etc.)
        if ((query as any)[operator]) {
          query = (query as any)[operator](column, value);
        }
      });
    }

    // Apply sorting
    if (sorting.length > 0) {
      sorting.forEach((sort) => {
        const { column, direction = "asc" } = sort;
        query = query.order(column as string, {
          ascending: direction.toLowerCase() === "asc",
        });
      });
    }

    // For single record requests, use maybeSingle() to get null instead of error for not found
    if (single) {
      const { data, error } = await query.maybeSingle();
      return { data, error };
    }

    // Apply limit for pagination
    if (limit !== null) {
      query = query.limit(limit);
    }

    // Execute the query
    const { data, error } = await query;

    // Special handling for limit=1 case but not using single mode
    // This ensures consistent return types
    if (Array.isArray(data) && limit === 1) {
      if (data.length > 0) {
        return { data: data[0] as TResponseData, error };
      } else {
        return { data: null, error: error || { message: "No records found" } };
      }
    }

    // Default return with proper typing
    return { data: data as TResponseData | null, error };
  });
};
