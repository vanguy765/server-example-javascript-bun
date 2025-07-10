// Generated repository pattern helpers from database schema
// Source: C:\Users\3900X\Code\vapiordie3\vapiordie3\src\supabase\schema.sql
// Generated on: 2025-06-08T21:29:14.889Z

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './generated.types';

/**
 * Repository factory function to create type-safe repositories for database tables
 */
export function createRepository<T extends keyof Database['public']['Tables']>(
  client: SupabaseClient<Database>,
  tableName: T
) {
  return {
    /**
     * Get all records from the table
     */
    getAll: async () => {
      const { data, error } = await client
        .from(tableName)
        .select();
      
      if (error) throw error;
      return data;
    },
    
    /**
     * Get a single record by ID
     */
    getById: async (id: string | number) => {
      const { data, error } = await client
        .from(tableName)
        .select()
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    /**
     * Create a new record
     */
    create: async <InsertType extends Database['public']['Tables'][T]['Insert']>(
      record: InsertType
    ) => {
      const { data, error } = await client
        .from(tableName)
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    /**
     * Update an existing record
     */
    update: async <UpdateType extends Database['public']['Tables'][T]['Update']>(
      id: string | number,
      updates: UpdateType
    ) => {
      const { data, error } = await client
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    /**
     * Delete a record
     */
    delete: async (id: string | number) => {
      const { error } = await client
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    
    /**
     * Query builder to create a custom query
     */
    query: () => client.from(tableName),
  };
}

/**
 * Repository for the access_phones table
 */
export function createAccessPhonesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'access_phones');
}

/**
 * Repository for the agents table
 */
export function createAgentsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'agents');
}

/**
 * Repository for the api_keys table
 */
export function createApiKeysRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'api_keys');
}

/**
 * Repository for the audit_logs table
 */
export function createAuditLogsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'audit_logs');
}

/**
 * Repository for the call_logs table
 */
export function createCallLogsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'call_logs');
}

/**
 * Repository for the customer_preferences table
 */
export function createCustomerPreferencesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'customer_preferences');
}

/**
 * Repository for the customers table
 */
export function createCustomersRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'customers');
}

/**
 * Repository for the industries table
 */
export function createIndustriesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'industries');
}

/**
 * Repository for the ip_allowlist table
 */
export function createIpAllowlistRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'ip_allowlist');
}

/**
 * Repository for the messages table
 */
export function createMessagesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'messages');
}

/**
 * Repository for the order_items table
 */
export function createOrderItemsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'order_items');
}

/**
 * Repository for the orders table
 */
export function createOrdersRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'orders');
}

/**
 * Repository for the product_categories table
 */
export function createProductCategoriesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'product_categories');
}

/**
 * Repository for the product_specials table
 */
export function createProductSpecialsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'product_specials');
}

/**
 * Repository for the products table
 */
export function createProductsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'products');
}

/**
 * Repository for the product_types table
 */
export function createProductTypesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'product_types');
}

/**
 * Repository for the proposed_orders table
 */
export function createProposedOrdersRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'proposed_orders');
}

/**
 * Repository for the proposed_orders_data table
 */
export function createProposedOrdersDataRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'proposed_orders_data');
}

/**
 * Repository for the roles table
 */
export function createRolesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'roles');
}

/**
 * Repository for the tenants table
 */
export function createTenantsRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'tenants');
}

/**
 * Repository for the user_preferences table
 */
export function createUserPreferencesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'user_preferences');
}

/**
 * Repository for the user_roles table
 */
export function createUserRolesRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'user_roles');
}

/**
 * Repository for the users table
 */
export function createUsersRepository(client: SupabaseClient<Database>) {
  return createRepository(client, 'users');
}

