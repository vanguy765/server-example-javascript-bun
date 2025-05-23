-- Schema Introspection Functions for Supabase
-- These functions need to be run on your Supabase database to provide
-- the necessary data for the MCP server

-- Function to get all tables in a schema
CREATE OR REPLACE FUNCTION public.select_tables(schema_name text)
RETURNS TABLE(tablename text) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT t.tablename::text 
    FROM pg_tables t 
    WHERE t.schemaname = schema_name 
    AND t.tablename NOT LIKE 'pg_%';
END;
$$ LANGUAGE plpgsql;

-- Function to get foreign keys for a table
CREATE OR REPLACE FUNCTION public.get_foreign_keys(table_name text) 
RETURNS TABLE(
  column_name text,
  foreign_table_name text,
  foreign_column_name text,
  constraint_name text
) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY 
  SELECT
    kcu.column_name::text,
    ccu.table_name::text AS foreign_table_name,
    ccu.column_name::text AS foreign_column_name,
    tc.constraint_name::text
  FROM
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = table_name
    AND tc.table_schema = 'public';
END;
$$ LANGUAGE plpgsql;

-- Function to get indexes for a table
CREATE OR REPLACE FUNCTION public.get_indexes(table_name text) 
RETURNS TABLE(
  index_name text,
  column_names text[],
  is_unique boolean,
  is_primary boolean
) SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY 
  SELECT
    i.relname::text AS index_name,
    array_agg(a.attname::text) AS column_names,
    ix.indisunique AS is_unique,
    ix.indisprimary AS is_primary
  FROM
    pg_class t,
    pg_class i,
    pg_index ix,
    pg_attribute a
  WHERE
    t.oid = ix.indrelid
    AND i.oid = ix.indexrelid
    AND a.attrelid = t.oid
    AND a.attnum = ANY(ix.indkey)
    AND t.relkind = 'r'
    AND t.relname = table_name
    AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  GROUP BY
    i.relname, ix.indisunique, ix.indisprimary;
END;
$$ LANGUAGE plpgsql;
