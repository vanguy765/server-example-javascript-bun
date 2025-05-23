import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * Schema Introspection Service
 *
 * This service allows you to query your Supabase database schema metadata
 * and generate TypeScript types and Zod validation schemas dynamically.
 */
export class SchemaIntrospector {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  /**
   * Get all tables in the public schema
   */
  async getTables(): Promise<string[]> {
    try {
      // Try a direct query to pg_tables which is usually accessible
      const { data, error } = await this.supabase
        .from("pg_tables")
        .select("tablename")
        .eq("schemaname", "public")
        .not("tablename", "like", "pg_%"); // Exclude PostgreSQL system tables

      if (error) {
        throw new Error(`Error fetching tables: ${error.message}`);
      }

      return data.map((table: { tablename: string }) => table.tablename);
    } catch (error) {
      console.error("Failed to query pg_tables directly, trying raw SQL...");

      // Last resort - use raw SQL query with executeRaw if available
      try {
        // Using a raw SQL query directly since RPC doesn't exist
        const { data, error: sqlError } = await this.supabase
          .rpc("select_tables", { schema_name: "public" })
          .select("*");

        if (sqlError || !data) {
          throw new Error(`SQL query failed: ${(sqlError as Error)?.message}`);
        }

        return data;
      } catch (sqlError) {
        console.error("All table query methods failed");

        // If everything fails, return an empty array rather than crashing
        console.warn(
          "Could not retrieve tables from database. Returning empty array."
        );
        return [];
      }
    }
  }

  /**
   * Get all columns for a specific table
   */
  async getTableColumns(tableName: string) {
    const { data, error } = await this.supabase
      .from("information_schema.columns")
      .select(
        `
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length,
        numeric_precision,
        numeric_scale
      `
      )
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .order("ordinal_position");

    if (error) {
      throw new Error(
        `Error fetching columns for ${tableName}: ${error.message}`
      );
    }

    return data;
  }

  /**
   * Get primary key columns for a specific table
   */
  async getPrimaryKeys(tableName: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from("information_schema.key_column_usage")
      .select("column_name")
      .eq("table_schema", "public")
      .eq("table_name", tableName)
      .eq("constraint_name", `${tableName}_pkey`);

    if (error) {
      console.warn(
        `Warning: Could not fetch primary keys for ${tableName}: ${error.message}`
      );
      return [];
    }

    return data?.map((pk) => pk.column_name) || [];
  }
  /**
   * Get all enum types in the database
   */
  async getEnumTypes(): Promise<Record<string, string[]>> {
    try {
      // Directly query pg_type and pg_enum tables
      // Note: This approach doesn't use RPC functions which might not exist
      const { data, error } = await this.supabase
        .from("pg_type")
        .select(
          `
          typname,
          oid
        `
        )
        .eq("typtype", "e"); // Filter for enum types

      if (error) {
        console.warn(`Warning: Could not fetch enum types: ${error.message}`);
        return {};
      }

      // Process each enum type to get its values
      const enumTypes: Record<string, string[]> = {};

      for (const type of data) {
        const typeName = type.typname;
        enumTypes[typeName] = [];

        // Get the enum values for this type
        const { data: enumValues, error: enumError } = await this.supabase
          .from("pg_enum")
          .select("enumlabel")
          .eq("enumtypid", type.oid)
          .order("enumsortorder");

        if (!enumError && enumValues) {
          enumTypes[typeName] = enumValues.map((e) => e.enumlabel);
        }
      }

      return enumTypes;
    } catch (error) {
      console.warn(
        `Warning: Could not fetch enums: ${(error as Error).message}`
      );
      return {};
    }
  }

  /**
   * Generate TypeScript interface for a table
   */
  async generateTableInterface(tableName: string): Promise<string> {
    const columns = await this.getTableColumns(tableName);

    let interfaceContent = `export interface ${this.pascalCase(tableName)} {\n`;

    for (const column of columns) {
      const isNullable = column.is_nullable.toLowerCase() === "yes";
      const tsType = this.mapPostgreSQLToTypeScript(column);
      interfaceContent += `  ${column.column_name}${
        isNullable ? "?" : ""
      }: ${tsType};\n`;
    }

    interfaceContent += `}\n`;
    return interfaceContent;
  }

  /**
   * Generate Zod schema for a table
   */
  async generateTableSchema(tableName: string): Promise<string> {
    const columns = await this.getTableColumns(tableName);

    let schemaContent = `export const ${tableName}Schema = z.object({\n`;

    for (const column of columns) {
      const zodType = this.mapPostgreSQLToZod(column);
      schemaContent += `  ${column.column_name}: ${zodType},\n`;
    }

    schemaContent += `});\n\n`;

    // Generate Insert and Update schemas
    const generatedFields = columns
      .filter((col) => this.isAutoGenerated(col))
      .map((col) => col.column_name);

    if (generatedFields.length > 0) {
      schemaContent += `export const ${tableName}InsertSchema = ${tableName}Schema.omit({\n`;
      for (const field of generatedFields) {
        schemaContent += `  ${field}: true,\n`;
      }
      schemaContent += `});\n\n`;
    } else {
      schemaContent += `export const ${tableName}InsertSchema = ${tableName}Schema;\n\n`;
    }

    // Update schema (all fields optional)
    schemaContent += `export const ${tableName}UpdateSchema = ${tableName}InsertSchema.partial();\n\n`;

    // Type exports
    schemaContent += `export type ${this.pascalCase(
      tableName
    )} = z.infer<typeof ${tableName}Schema>;\n`;
    schemaContent += `export type ${this.pascalCase(
      tableName
    )}Insert = z.infer<typeof ${tableName}InsertSchema>;\n`;
    schemaContent += `export type ${this.pascalCase(
      tableName
    )}Update = z.infer<typeof ${tableName}UpdateSchema>;\n\n`;

    return schemaContent;
  }

  /**
   * Generate repository functions for a table
   */
  async generateRepositoryFunctions(tableName: string): Promise<string> {
    const pascalName = this.pascalCase(tableName);

    return `
import { supabaseClient } from "./client";
import { ${pascalName}, ${pascalName}Insert, ${pascalName}Update } from "./generated.schemas";
import { ${tableName}Schema, ${tableName}InsertSchema, ${tableName}UpdateSchema } from "./generated.schemas";

/**
 * Repository functions for ${tableName}
 */

// Get all ${tableName}
export async function getAll${pascalName}s(): Promise<${pascalName}[]> {
  const { data, error } = await supabaseClient.from("${tableName}").select("*");

  if (error) {
    console.error("Error fetching ${tableName}:", error);
    throw error;
  }

  return data as ${pascalName}[];
}

// Get ${tableName} by ID
export async function get${pascalName}ById(id: string): Promise<${pascalName} | null> {
  const { data, error } = await supabaseClient
    .from("${tableName}")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching ${tableName} by ID:", error);
    throw error;
  }

  return data as ${pascalName};
}

// Create a new ${tableName} with validation
export async function create${pascalName}(
  ${tableName}: ${pascalName}Insert
): Promise<${pascalName}> {
  // Validate with Zod schema
  ${tableName}InsertSchema.parse(${tableName});

  const { data, error } = await supabaseClient
    .from("${tableName}")
    .insert(${tableName})
    .select()
    .single();

  if (error) {
    console.error("Error creating ${tableName}:", error);
    throw error;
  }

  return data as ${pascalName};
}

// Update an existing ${tableName} with validation
export async function update${pascalName}(
  id: string,
  ${tableName}: ${pascalName}Update
): Promise<${pascalName}> {
  // Validate with Zod schema
  ${tableName}UpdateSchema.parse(${tableName});

  const { data, error } = await supabaseClient
    .from("${tableName}")
    .update(${tableName})
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating ${tableName}:", error);
    throw error;
  }

  return data as ${pascalName};
}

// Delete a ${tableName} by ID
export async function delete${pascalName}(id: string): Promise<void> {
  const { error } = await supabaseClient.from("${tableName}").delete().eq("id", id);

  if (error) {
    console.error("Error deleting ${tableName}:", error);
    throw error;
  }
}
`;
  }

  // Helper functions

  // Convert snake_case to PascalCase
  private pascalCase(str: string): string {
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  // Convert PostgreSQL data type to TypeScript type
  private mapPostgreSQLToTypeScript(column: {
    data_type: string;
    is_nullable: string;
  }): string {
    switch (column.data_type.toLowerCase()) {
      case "integer":
      case "bigint":
      case "smallint":
      case "decimal":
      case "numeric":
      case "real":
      case "double precision":
        return "number";

      case "boolean":
        return "boolean";

      case "json":
      case "jsonb":
        return "unknown";

      case "timestamp without time zone":
      case "timestamp with time zone":
      case "date":
      case "time without time zone":
      case "time with time zone":
        return "string"; // or Date if you prefer

      case "character varying":
      case "text":
      case "uuid":
      case "varchar":
      case "char":
      default:
        return "string";
    }
  }

  // Convert PostgreSQL data type to Zod validator
  private mapPostgreSQLToZod(column: {
    data_type: string;
    is_nullable: string;
    column_name: string;
  }): string {
    const isNullable = column.is_nullable.toLowerCase() === "yes";
    let zodType: string;

    switch (column.data_type.toLowerCase()) {
      case "integer":
      case "bigint":
      case "smallint":
      case "decimal":
      case "numeric":
      case "real":
      case "double precision":
        zodType = "z.number()";
        if (
          column.column_name === "price" ||
          column.column_name.endsWith("_price")
        ) {
          zodType += '.nonnegative("Price must be non-negative")';
        }
        break;

      case "boolean":
        zodType = "z.boolean()";
        break;

      case "json":
      case "jsonb":
        zodType = "z.unknown()";
        break;

      case "timestamp without time zone":
      case "timestamp with time zone":
      case "date":
        zodType = "z.string()"; // Use .datetime() if using zod extension
        break;

      case "uuid":
        zodType = "z.string().uuid()";
        break;

      case "character varying":
      case "text":
      case "varchar":
      case "char":
      default:
        zodType = "z.string()";

        // Add specific validations based on column names
        if (
          column.column_name === "email" ||
          column.column_name.endsWith("_email")
        ) {
          zodType += '.email("Invalid email format")';
        } else if (
          column.column_name === "url" ||
          column.column_name.endsWith("_url")
        ) {
          zodType += '.url("Invalid URL format")';
        }

        break;
    }

    // Make nullable if needed
    if (isNullable) {
      zodType += ".nullable()";
    }

    return zodType;
  }

  // Check if a column is likely auto-generated
  private isAutoGenerated(column: {
    column_name: string;
    column_default?: string | null;
  }): boolean {
    // Common auto-generated columns
    if (["id", "created_at", "updated_at"].includes(column.column_name)) {
      return true;
    }

    // Check for auto-increment or UUID generation in default value
    if (column.column_default) {
      if (
        column.column_default.includes("nextval") ||
        column.column_default.includes("gen_random_uuid") ||
        column.column_default.includes("uuid_generate_v4") ||
        column.column_default.includes("now()")
      ) {
        return true;
      }
    }

    return false;
  }
}
