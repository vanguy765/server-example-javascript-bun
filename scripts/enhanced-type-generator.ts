import fs from "fs";
import path from "path";
import {
  parseSchemaFile,
  ParsedSchema,
  Table,
  TableColumn,
} from "./enhanced-schema-parser";

// Paths
const SCHEMA_SQL_PATH = path.join(__dirname, "../src/supabase/schema.sql");
const TYPES_PATH = path.join(__dirname, "../src/supabase/generated.types.ts");
const SCHEMAS_PATH = path.join(
  __dirname,
  "../src/supabase/generated.schemas.ts"
);
const REPO_PATH = path.join(__dirname, "../src/supabase/generated-repo.ts");
const ENUMS_PATH = path.join(__dirname, "../src/supabase/generated.enums.ts");

// PostgreSQL to TypeScript type mapping
function pgTypeToTsType(pgType: string, enums: ParsedSchema["enums"]): string {
  // Handle array types
  if (pgType.endsWith("[]")) {
    const baseType = pgType.slice(0, -2);
    return `${pgTypeToTsType(baseType, enums)}[]`;
  }

  // Handle enum types
  const enumType = enums.find(
    (e) => e.name === pgType || `${e.schema}.${e.name}` === pgType
  );

  if (enumType) {
    return enumType.name;
  }

  // Clean up any type parameters or modifiers
  const cleanType = pgType.replace(/\(\d+(?:,\d+)?\)/, "").trim();

  const typeMap: Record<string, string> = {
    // Numeric types
    smallint: "number",
    integer: "number",
    int: "number",
    bigint: "number",
    decimal: "number",
    numeric: "number",
    real: "number",
    "double precision": "number",
    serial: "number",
    bigserial: "number",
    money: "number",

    // Character types
    "character varying": "string",
    varchar: "string",
    character: "string",
    char: "string",
    text: "string",

    // Boolean type
    boolean: "boolean",
    bool: "boolean",

    // Date/Time types
    timestamp: "string", // Could also be Date
    "timestamp with time zone": "string",
    "timestamp without time zone": "string",
    timestamptz: "string",
    date: "string", // Could also be Date
    time: "string",
    "time with time zone": "string",
    "time without time zone": "string",
    timetz: "string",
    interval: "string",

    // Binary types
    bytea: "Uint8Array",

    // JSON types
    json: "Json",
    jsonb: "Json",

    // UUID type
    uuid: "string",

    // Network types
    cidr: "string",
    inet: "string",
    macaddr: "string",

    // Geometric types
    point: "string",
    line: "string",
    lseg: "string",
    box: "string",
    path: "string",
    polygon: "string",
    circle: "string",

    // Others default to string or any
    tsquery: "string",
    tsvector: "string",
    xml: "string",
  };

  return typeMap[cleanType.toLowerCase()] || "any";
}

// PostgreSQL to Zod schema mapping
function pgTypeToZodSchema(
  column: TableColumn,
  enums: ParsedSchema["enums"]
): string {
  const { type: pgType, name: columnName, isNullable } = column;
  let baseType = pgType.replace(/\[\]$/, "").toLowerCase();
  // Remove any type parameters like varchar(255) -> varchar
  baseType = baseType.replace(/\(\d+(?:,\d+)?\)/, "");

  // Handle array types
  const isArray = pgType.endsWith("[]");

  // Handle enum types
  const enumType = enums.find(
    (e) => e.name === baseType || `${e.schema}.${e.name}` === baseType
  );

  if (enumType) {
    const zodType = `z.enum([${enumType.values
      .map((v) => `'${v}'`)
      .join(", ")}])`;
    if (isArray) {
      return isNullable
        ? `z.array(${zodType}).nullish()`
        : `z.array(${zodType})`;
    }
    return isNullable ? `${zodType}.nullish()` : zodType;
  }

  let zodType: string;

  switch (baseType) {
    // Numeric types
    case "smallint":
    case "integer":
    case "int":
    case "bigint":
    case "decimal":
    case "numeric":
    case "real":
    case "double precision":
    case "serial":
    case "bigserial":
    case "money":
      zodType = "z.number()";
      break;

    // String types
    case "character varying":
    case "varchar":
    case "character":
    case "char":
    case "text":
    case "uuid":
    case "cidr":
    case "inet":
    case "macaddr":
      zodType = "z.string()";
      break;

    // Boolean type
    case "boolean":
    case "bool":
      zodType = "z.boolean()";
      break;

    // Date/Time types that we handle as strings
    case "timestamp":
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "timestamptz":
    case "date":
    case "time":
    case "time with time zone":
    case "time without time zone":
    case "timetz":
    case "interval":
      zodType = "z.string()";
      break;

    // JSON types
    case "json":
    case "jsonb":
      zodType = "z.custom<Json>((val) => true)"; // Simple validation for JSON
      break;

    // Binary types
    case "bytea":
      zodType = "z.instanceof(Uint8Array)";
      break;

    // Default case
    default:
      zodType = "z.any()";
      break;
  }

  if (isArray) {
    zodType = `z.array(${zodType})`;
  }

  return isNullable ? `${zodType}.nullish()` : zodType;
}

// Generate TypeScript types from parsed schema
function generateTypeDefinitions(schema: ParsedSchema): string {
  const { tables, enums } = schema;

  const publicTables = tables.filter((t) => t.schema === "public");

  let output = `// Generated from database schema
// Source: ${SCHEMA_SQL_PATH}
// Generated on: ${new Date().toISOString()}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
`;

  for (const table of publicTables) {
    output += `      ${table.name}: {\n`;

    // Row type (data returned from a query)
    output += `        Row: {\n`;
    for (const column of table.columns) {
      const tsType = pgTypeToTsType(column.type, enums);
      const nullable = column.isNullable ? " | null" : "";
      const description = column.description ? ` // ${column.description}` : "";
      output += `          ${column.name}: ${tsType}${nullable}${description}\n`;
    }
    output += `        }\n`;

    // Insert type (data that can be inserted)
    output += `        Insert: {\n`;
    for (const column of table.columns) {
      const tsType = pgTypeToTsType(column.type, enums);
      const optional =
        !column.isPrimaryKey &&
        (column.defaultValue !== null || column.isNullable)
          ? "?"
          : "";
      const nullable = column.isNullable ? " | null" : "";
      output += `          ${column.name}${optional}: ${tsType}${nullable}\n`;
    }
    output += `        }\n`;

    // Update type (data that can be updated)
    output += `        Update: {\n`;
    for (const column of table.columns) {
      const tsType = pgTypeToTsType(column.type, enums);
      const nullable = column.isNullable ? " | null" : "";
      output += `          ${column.name}?: ${tsType}${nullable}\n`;
    }
    output += `        }\n`;

    output += `      }\n`;
  }

  output += `    }\n`;

  // Add Views section
  output += `    Views: {\n`;
  output += `      [_ in never]: never\n`;
  output += `    }\n`;

  // Add Functions section
  output += `    Functions: {\n`;
  output += `      [_ in never]: never\n`;
  output += `    }\n`;

  // Add Enums section if there are any
  output += `    Enums: {\n`;
  if (enums.length > 0) {
    for (const enumDef of enums.filter((e) => e.schema === "public")) {
      output += `      ${enumDef.name}: ${enumDef.values
        .map((v) => `'${v}'`)
        .join(" | ")}\n`;
    }
  } else {
    output += `      [_ in never]: never\n`;
  }
  output += `    }\n`;

  output += `  }\n`;
  output += `}\n\n`;

  // Add simple type aliases for tables
  output += `// Type aliases for tables\n`;
  for (const table of publicTables) {
    const pascalCaseName = table.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    output += `export type ${pascalCaseName} = Database['public']['Tables']['${table.name}']['Row']\n`;
    output += `export type ${pascalCaseName}Insert = Database['public']['Tables']['${table.name}']['Insert']\n`;
    output += `export type ${pascalCaseName}Update = Database['public']['Tables']['${table.name}']['Update']\n\n`;
  }

  return output;
}

// Generate Zod schemas from parsed schema
function generateZodSchemas(schema: ParsedSchema): string {
  const { tables, enums } = schema;

  const publicTables = tables.filter((t) => t.schema === "public");

  let output = `// Generated Zod schemas from database
// Source: ${SCHEMA_SQL_PATH}
// Generated on: ${new Date().toISOString()}

import { z } from 'zod';
import { Json } from './generated.types';

`;

  for (const table of publicTables) {
    const pascalCaseName = table.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    // Row schema
    output += `export const ${pascalCaseName}Schema = z.object({\n`;
    for (const column of table.columns) {
      const zodType = pgTypeToZodSchema(column, enums);
      const description = column.description ? ` // ${column.description}` : "";
      output += `  ${column.name}: ${zodType},${description}\n`;
    }
    output += `});\n\n`;

    // Insert schema
    output += `export const ${pascalCaseName}InsertSchema = z.object({\n`;
    for (const column of table.columns) {
      const zodType = pgTypeToZodSchema(column, enums);
      const optional =
        !column.isPrimaryKey &&
        (column.defaultValue !== null || column.isNullable);
      output += optional
        ? `  ${column.name}: ${zodType}.optional(),\n`
        : `  ${column.name}: ${zodType},\n`;
    }
    output += `});\n\n`;

    // Update schema
    output += `export const ${pascalCaseName}UpdateSchema = z.object({\n`;
    for (const column of table.columns) {
      const zodType = pgTypeToZodSchema(column, enums);
      output += `  ${column.name}: ${zodType}.optional(),\n`;
    }
    output += `}).partial();\n\n`;
  }

  return output;
}

// Generate repository pattern helpers
function generateRepositoryHelpers(schema: ParsedSchema): string {
  const { tables } = schema;

  const publicTables = tables.filter((t) => t.schema === "public");

  let output = `// Generated repository pattern helpers from database schema
// Source: ${SCHEMA_SQL_PATH}
// Generated on: ${new Date().toISOString()}

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

`;

  // Add specific repositories for each table
  for (const table of publicTables) {
    const pascalCaseName = table.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    output += `/**
 * Repository for the ${table.name} table
 */
export function create${pascalCaseName}Repository(client: SupabaseClient<Database>) {
  return createRepository(client, '${table.name}');
}\n\n`;
  }

  return output;
}

// Generate enum definitions
function generateEnumDefinitions(schema: ParsedSchema): string {
  const { enums } = schema;
  const publicEnums = enums.filter((e) => e.schema === "public");

  if (publicEnums.length === 0) {
    return `// No enum types found in database schema
export {};`;
  }

  let output = `// Generated enum definitions from database schema
// Source: ${SCHEMA_SQL_PATH}
// Generated on: ${new Date().toISOString()}

`;

  for (const enumDef of publicEnums) {
    const pascalCaseName = enumDef.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    output += `/**
 * ${enumDef.description || `Enum type for ${enumDef.name}`}
 */
export enum ${pascalCaseName} {\n`;

    for (const value of enumDef.values) {
      // Create a valid enum key (capitalize and replace special characters)
      const enumKey = value.toUpperCase().replace(/[^A-Z0-9_]/g, "_");

      output += `  ${enumKey} = '${value}',\n`;
    }

    output += `}\n\n`;
  }

  return output;
}

// Main function to generate all type files from schema
export async function generateAllTypesFromSchema(
  schemaPath: string = SCHEMA_SQL_PATH
): Promise<void> {
  try {
    console.log(`Parsing schema from: ${schemaPath}`);
    const schema = parseSchemaFile(schemaPath);

    console.log(
      `Found ${schema.tables.length} tables and ${schema.enums.length} enum types`
    );

    console.log("Generating TypeScript types...");
    const typeDefinitions = generateTypeDefinitions(schema);
    fs.writeFileSync(TYPES_PATH, typeDefinitions);
    console.log(`✅ TypeScript types written to: ${TYPES_PATH}`);

    console.log("Generating Zod schemas...");
    const zodSchemas = generateZodSchemas(schema);
    fs.writeFileSync(SCHEMAS_PATH, zodSchemas);
    console.log(`✅ Zod schemas written to: ${SCHEMAS_PATH}`);

    console.log("Generating repository helpers...");
    const repoHelpers = generateRepositoryHelpers(schema);
    fs.writeFileSync(REPO_PATH, repoHelpers);
    console.log(`✅ Repository helpers written to: ${REPO_PATH}`);

    if (schema.enums.length > 0) {
      console.log("Generating enum definitions...");
      const enumDefinitions = generateEnumDefinitions(schema);
      fs.writeFileSync(ENUMS_PATH, enumDefinitions);
      console.log(`✅ Enum definitions written to: ${ENUMS_PATH}`);
    }

    console.log("✨ All types generated successfully!");
  } catch (error) {
    console.error("Error generating types:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  generateAllTypesFromSchema();
}
