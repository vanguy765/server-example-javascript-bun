// Auto-generated repository functions from Supabase schema
// Generated on: 2025-05-23T00:26:02.702Z

import { supabaseClient } from './client';


/**
 * Repository factory - creates type-safe repository functions for any table
 */
export function createRepository<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  return {
    getAll: async () => {
      const { data, error } = await supabaseClient.from(tableName).select('*');
      if (error) throw error;
      return data;
    },
    getById: async (id: string) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    create: async (record: any) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    update: async (id: string, record: any) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .update(record)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    delete: async (id: string) => {
      const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    }
  };
}

// Pre-generated repositories
export const repositories = {

};
