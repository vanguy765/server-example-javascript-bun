import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Paths
const SCHEMA_SQL_PATH = path.join(__dirname, "../src/supabase/schema.sql");
const TYPES_PATH = path.join(__dirname, "../src/supabase/generated.types.ts");
const SCHEMAS_PATH = path.join(
  __dirname,
  "../src/supabase/generated.schemas.ts"
);
const REPO_PATH = path.join(__dirname, "../src/supabase/generated-repo.ts");

// PostgreSQL to TypeScript type mapping
const pgTypeToTsType = (pgType: string): string => {
  const typeMap: Record<string, string> = {
    // Numeric types
    smallint: "number",
    integer: "number",
    bigint: "number",
    decimal: "number",
    numeric: "number",
    real: "number",
    "double precision": "number",
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
    date: "string", // Could also be Date
    time: "string",
    "time with time zone": "string",
    "time without time zone": "string",
    interval: "string",

    // Binary types
    bytea: "Uint8Array",

    // JSON types
    json: "Json",
    jsonb: "Json",

    // UUID type
    uuid: "string",

    // Array types - will be handled specifically

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

  // Handle array types
  if (pgType.endsWith("[]")) {
    const baseType = pgType.slice(0, -2);
    return `${pgTypeToTsType(baseType)}[]`;
  }

  return typeMap[pgType.toLowerCase()] || "any";
};

// PostgreSQL to Zod schema mapping
const pgTypeToZodSchema = (
  pgType: string,
  columnName: string,
  isNullable: boolean
): string => {
  const baseType = pgType.replace(/\[\]$/, "").toLowerCase();
  let zodType: string;

  // Handle array types
  const isArray = pgType.endsWith("[]");

  switch (baseType) {
    // Numeric types
    case "smallint":
    case "integer":
    case "bigint":
    case "decimal":
    case "numeric":
    case "real":
    case "double precision":
    case "money":
      zodType = "z.number()";
      break;

    // Text types
    case "character varying":
    case "varchar":
    case "character":
    case "char":
    case "text":
      zodType = "z.string()";
      break;

    // Boolean type
    case "boolean":
    case "bool":
      zodType = "z.boolean()";
      break;

    // Date/Time types
    case "timestamp":
    case "timestamp with time zone":
    case "timestamp without time zone":
      zodType = "z.string().datetime()";
      break;
    case "date":
      zodType = "z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/)";
      break;
    case "time":
    case "time with time zone":
    case "time without time zone":
    case "interval":
      zodType = "z.string()";
      break;

    // UUID type
    case "uuid":
      zodType = "z.string().uuid()";
      break;

    // JSON types
    case "json":
    case "jsonb":
      zodType = "jsonSchema";
      break;

    // Default
    default:
      zodType = "z.any()";
  }

  // Add array wrapper if needed
  if (isArray) {
    zodType = `z.array(${zodType})`;
  }

  // Add nullable if needed
  if (isNullable) {
    zodType = `${zodType}.nullable()`;
  }

  return zodType;
};

// Parse SQL CREATE TABLE statements
const parseCreateTableStatements = (sqlContent: string): any[] => {
  const tables: any[] = [];

  // Regular expression to match CREATE TABLE statements
  const createTableRegex =
    /CREATE TABLE (IF NOT EXISTS)?\s*(?:(?:[a-zA-Z0-9_"]+)\.)?([a-zA-Z0-9_"]+)\s*\(([\s\S]+?)\);/g;

  // Regular expression to match column definitions within CREATE TABLE
  const columnDefRegex =
    /\s*"?([a-zA-Z0-9_]+)"?\s+([a-zA-Z0-9_ \[\]]+)(?:\s+COLLATE\s+[a-zA-Z0-9_"]+)?(?:\s+NOT NULL)?(?:\s+DEFAULT\s+[^,]+)?(?:\s+CONSTRAINT\s+[a-zA-Z0-9_"]+)?(?:\s+PRIMARY KEY)?(?:\s+REFERENCES\s+[^,]+)?/g;

  // Find all CREATE TABLE statements
  let tableMatch;
  while ((tableMatch = createTableRegex.exec(sqlContent)) !== null) {
    const tableName = tableMatch[2].replace(/"/g, "");
    const columnsDefinition = tableMatch[3];

    const columns: any[] = [];

    // Find all column definitions within the CREATE TABLE statement
    let columnMatch;
    while ((columnMatch = columnDefRegex.exec(columnsDefinition)) !== null) {
      const columnName = columnMatch[1].replace(/"/g, "");
      let columnType = columnMatch[2].trim();

      // Check if the column is nullable
      const isNullable = !columnsDefinition.includes(
        `${columnName}"? NOT NULL`
      );

      columns.push({
        name: columnName,
        type: columnType,
        tsType: pgTypeToTsType(columnType),
        zodType: pgTypeToZodSchema(columnType, columnName, isNullable),
        isNullable,
      });
    }

    // Get primary key information
    const primaryKeyRegex =
      /PRIMARY KEY\s*\("?([a-zA-Z0-9_]+"?(?:\s*,\s*"?[a-zA-Z0-9_]+"?)*)\)/i;
    const primaryKeyMatch = columnsDefinition.match(primaryKeyRegex);
    const primaryKeys = primaryKeyMatch
      ? primaryKeyMatch[1].split(",").map((key) => key.trim().replace(/"/g, ""))
      : [];

    tables.push({
      name: tableName,
      columns,
      primaryKeys,
    });
  }

  return tables;
};

// Parse SQL CREATE TYPE statements for enums
const parseCreateEnumStatements = (sqlContent: string): any[] => {
  const enums: any[] = [];

  // Regular expression to match CREATE TYPE ... AS ENUM statements
  const createEnumRegex =
    /CREATE TYPE (IF NOT EXISTS)?\s*(?:(?:[a-zA-Z0-9_"]+)\.)?([a-zA-Z0-9_"]+)\s+AS ENUM\s*\(([\s\S]+?)\);/g;

  let enumMatch;
  while ((enumMatch = createEnumRegex.exec(sqlContent)) !== null) {
    const enumName = enumMatch[2].replace(/"/g, "");
    const enumValues = enumMatch[3]
      .split(",")
      .map((value) => value.trim().replace(/^'|'$/g, "").replace(/\\'/g, "'"));

    enums.push({
      name: enumName,
      values: enumValues,
    });
  }

  return enums;
};

// Generate TypeScript type definitions
const generateTypeDefinitions = (tables: any[], enums: any[]): string => {
  let typeDefinitions = `// Auto-generated TypeScript types from PostgreSQL schema
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

  // Add table definitions
  tables.forEach((table) => {
    typeDefinitions += `      ${table.name}: {\n`;

    // Row type
    typeDefinitions += "        Row: {\n";
    table.columns.forEach((column) => {
      typeDefinitions += `          ${column.name}: ${
        column.isNullable ? `${column.tsType} | null` : column.tsType
      }\n`;
    });
    typeDefinitions += "        }\n";

    // Insert type
    typeDefinitions += "        Insert: {\n";
    table.columns.forEach((column) => {
      const isOptional =
        table.primaryKeys.includes(column.name) || column.isNullable;
      typeDefinitions += `          ${column.name}${isOptional ? "?" : ""}: ${
        column.isNullable ? `${column.tsType} | null` : column.tsType
      }\n`;
    });
    typeDefinitions += "        }\n";

    // Update type
    typeDefinitions += "        Update: {\n";
    table.columns.forEach((column) => {
      typeDefinitions += `          ${column.name}?: ${
        column.isNullable ? `${column.tsType} | null` : column.tsType
      }\n`;
    });
    typeDefinitions += "        }\n";

    typeDefinitions += "      }\n";
  });

  typeDefinitions += "    }\n";

  // Add enums
  typeDefinitions += "    Enums: {\n";
  enums.forEach((enumDef) => {
    typeDefinitions += `      ${enumDef.name}: ${enumDef.values
      .map((value) => `"${value}"`)
      .join(" | ")}\n`;
  });
  typeDefinitions += "    }\n";

  // Functions and Views are placeholders
  typeDefinitions += `    Functions: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
  }
}`;

  return typeDefinitions;
};

// Generate Zod validation schemas
const generateZodSchemas = (tables: any[], enums: any[]): string => {
  let schemaDefinitions = `// Auto-generated Zod schemas from PostgreSQL schema
// Generated on: ${new Date().toISOString()}
import { z } from 'zod';

// Base JSON schema
export const jsonSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(z.lazy(() => jsonSchema)),
  z.record(z.lazy(() => jsonSchema))
]);

// Enum schemas
`;

  // Add enum schemas
  enums.forEach((enumDef) => {
    schemaDefinitions += `export const ${
      enumDef.name
    }Schema = z.enum([${enumDef.values
      .map((value) => `"${value}"`)
      .join(", ")}]);\n`;
  });

  schemaDefinitions += "\n// Table schemas\n";

  // Add table schemas
  tables.forEach((table) => {
    // Row schema
    schemaDefinitions += `export const ${table.name}Schema = z.object({\n`;
    table.columns.forEach((column) => {
      schemaDefinitions += `  ${column.name}: ${column.zodType},\n`;
    });
    schemaDefinitions += "});\n\n";

    // Insert schema
    schemaDefinitions += `export const ${table.name}InsertSchema = z.object({\n`;
    table.columns.forEach((column) => {
      const isOptional =
        table.primaryKeys.includes(column.name) || column.isNullable;
      schemaDefinitions += `  ${column.name}: ${
        isOptional ? `${column.zodType}.optional()` : column.zodType
      },\n`;
    });
    schemaDefinitions += "});\n\n";

    // Update schema
    schemaDefinitions += `export const ${table.name}UpdateSchema = z.object({\n`;
    table.columns.forEach((column) => {
      schemaDefinitions += `  ${column.name}: ${column.zodType}.optional(),\n`;
    });
    schemaDefinitions += "}).partial();\n\n";
  });

  return schemaDefinitions;
};

// Generate repository helpers
const generateRepositoryHelpers = (tables: any[]): string => {
  let repoDefinitions = `// Auto-generated repository helpers from PostgreSQL schema
// Generated on: ${new Date().toISOString()}
import { createClient } from '@supabase/supabase-js';
import { Database } from './generated.types';
import * as schemas from './generated.schemas';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

// Repository factory function
export function createRepository<T extends keyof Database['public']['Tables']>(
  tableName: T
) {
  return {
    // Get all records
    getAll: async () => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('*');
      
      if (error) throw error;
      return data;
    },
    
    // Get a single record by ID
    getById: async (id: string) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    
    // Create a new record
    create: async (record: Database['public']['Tables'][T]['Insert']) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .insert(record)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    // Update a record
    update: async (id: string, updates: Database['public']['Tables'][T]['Update']) => {
      const { data, error } = await supabaseClient
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    // Delete a record
    delete: async (id: string) => {
      const { error } = await supabaseClient
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    
    // Query with filters
    query: async (queryFn: (query: any) => any) => {
      const query = supabaseClient.from(tableName).select('*');
      const enhanced = queryFn(query);
      const { data, error } = await enhanced;
      
      if (error) throw error;
      return data;
    }
  };
}

// Pre-configured repositories for each table
export const repositories = {
`;

  // Add repository for each table
  tables.forEach((table) => {
    repoDefinitions += `  ${table.name}: createRepository('${table.name}'),\n`;
  });

  repoDefinitions += `};

// Add type validation helpers
export const validators = {
`;

  // Add validators for each table
  tables.forEach((table) => {
    repoDefinitions += `  ${table.name}: {
    validate: (data: unknown) => schemas.${table.name}Schema.parse(data),
    validateInsert: (data: unknown) => schemas.${table.name}InsertSchema.parse(data),
    validateUpdate: (data: unknown) => schemas.${table.name}UpdateSchema.parse(data),
    safeParse: (data: unknown) => schemas.${table.name}Schema.safeParse(data),
    safeParseInsert: (data: unknown) => schemas.${table.name}InsertSchema.safeParse(data),
    safeParseUpdate: (data: unknown) => schemas.${table.name}UpdateSchema.safeParse(data),
  },\n`;
  });

  repoDefinitions += `};
`;

  return repoDefinitions;
};

// Main function
async function generateTypesFromSchema() {
  try {
    console.log("=== Generating TypeScript types from PostgreSQL schema ===");

    // Step 1: Check if schema.sql exists, if not, generate it
    if (!fs.existsSync(SCHEMA_SQL_PATH)) {
      console.log("Schema file not found, dumping schema from database...");
      const dumpCommand = `pg_dump --schema-only --no-owner --no-acl -f "${SCHEMA_SQL_PATH}" -h 127.0.0.1 -p 54322 -U postgres postgres`;

      try {
        await execAsync(dumpCommand);
        console.log(`Schema successfully dumped to: ${SCHEMA_SQL_PATH}`);
      } catch (dumpError) {
        console.error("Error dumping schema:", dumpError);
        console.error("Please manually create the schema.sql file");
        process.exit(1);
      }
    }

    // Step 2: Read the schema.sql file
    console.log(`Reading schema from: ${SCHEMA_SQL_PATH}`);
    const schemaContent = fs.readFileSync(SCHEMA_SQL_PATH, "utf8");

    // Step 3: Parse the schema
    console.log("Parsing schema...");
    const tables = parseCreateTableStatements(schemaContent);
    const enums = parseCreateEnumStatements(schemaContent);

    console.log(`Found ${tables.length} tables and ${enums.length} enums`);

    // Step 4: Generate TypeScript types
    console.log("Generating TypeScript type definitions...");
    const typeDefinitions = generateTypeDefinitions(tables, enums);
    fs.writeFileSync(TYPES_PATH, typeDefinitions);
    console.log(`TypeScript types written to: ${TYPES_PATH}`);

    // Step 5: Generate Zod schemas
    console.log("Generating Zod validation schemas...");
    const zodSchemas = generateZodSchemas(tables, enums);
    fs.writeFileSync(SCHEMAS_PATH, zodSchemas);
    console.log(`Zod schemas written to: ${SCHEMAS_PATH}`);

    // Step 6: Generate repository helpers
    console.log("Generating repository helpers...");
    const repositoryHelpers = generateRepositoryHelpers(tables);
    fs.writeFileSync(REPO_PATH, repositoryHelpers);
    console.log(`Repository helpers written to: ${REPO_PATH}`);

    console.log("=== Types generation complete! ===");
  } catch (error) {
    console.error("Error generating types from schema:", error);
    process.exit(1);
  }
}

// Run the generator
generateTypesFromSchema();
