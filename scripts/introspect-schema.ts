import * as fs from "fs";
import * as path from "path";
import { SchemaIntrospector } from "../src/supabase/schema-introspector";

/**
 * Type Generation Script
 *
 * This script automatically generates TypeScript types and Zod validation schemas
 * by introspecting your Supabase database schema.
 */

// Output file paths
const TYPES_OUTPUT = path.join(__dirname, "../src/supabase/generated.types.ts");
const SCHEMAS_OUTPUT = path.join(
  __dirname,
  "../src/supabase/generated.schemas.ts"
);
const REPO_OUTPUT = path.join(__dirname, "../src/supabase/generated-repo.ts");
const ENUMS_OUTPUT = path.join(__dirname, "../src/supabase/generated.enums.ts");

// Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "❌ Missing environment variables: SUPABASE_URL and/or SUPABASE_ANON_KEY"
  );
  console.log("Set these variables in your .env file or environment");
  process.exit(1);
}

async function generateTypes() {
  console.log("🚀 Starting schema introspection...");

  // Create the introspector
  const introspector = new SchemaIntrospector(supabaseUrl, supabaseKey);

  try {
    // Get all tables
    const tables = await introspector.getTables();
    console.log(`📋 Found ${tables.length} tables: ${tables.join(", ")}`);

    // Initialize output content    // Fetch enum types
    const enumTypes = await introspector.getEnumTypes();
    const enumNames = Object.keys(enumTypes);
    console.log(
      `📋 Found ${enumNames.length} enum types: ${
        enumNames.join(", ") || "none"
      }`
    );

    let typesContent = `// Auto-generated TypeScript types from Supabase schema
// Generated on: ${new Date().toISOString()}

export type Database = {
  public: {
    Tables: {
`;
    let schemasContent = `// Auto-generated Zod schemas from Supabase schema
// Generated on: ${new Date().toISOString()}

import { z } from 'zod';

`;

    // Generate enums content
    let enumsContent = `// Auto-generated enum types from Supabase schema
// Generated on: ${new Date().toISOString()}

/**
 * Database enum types
 * These are generated directly from PostgreSQL enum types
 */

`;

    // Add each enum type with TypeScript and Zod definitions
    for (const [enumName, enumValues] of Object.entries(enumTypes)) {
      const pascalCaseName = enumName
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join("");

      // Add TypeScript enum
      enumsContent += `// ${pascalCaseName} enum\n`;
      enumsContent += `export enum ${pascalCaseName} {\n`;
      enumValues.forEach((val) => {
        const enumKey = val
          .split("_")
          .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join("");
        enumsContent += `  ${enumKey} = "${val}",\n`;
      });
      enumsContent += `}\n\n`;

      // Add Zod enum validator
      enumsContent += `// ${pascalCaseName} Zod validator\n`;
      enumsContent += `export const ${enumName}Schema = z.enum([\n`;
      enumValues.forEach((val) => {
        enumsContent += `  "${val}",\n`;
      });
      enumsContent += `]);\n\n`;

      // Add Zod type export
      enumsContent += `// ${pascalCaseName} Zod type\n`;
      enumsContent += `export type ${pascalCaseName}Type = z.infer<typeof ${enumName}Schema>;\n\n`;
    }

    // Add utility function for working with enums
    enumsContent += `/**
 * Utility function to get all enum values for a given enum
 */
export function getEnumValues<T extends Record<string, string>>(enumObj: T): string[] {
  return Object.values(enumObj);
}
`;

    let repoContent = `// Auto-generated repository functions from Supabase schema
// Generated on: ${new Date().toISOString()}

import { supabaseClient } from './client';

`;

    // Process each table
    for (const tableName of tables) {
      console.log(`🔍 Processing table: ${tableName}`);

      // Generate types and schemas for the current table
      const tableInterface = await introspector.generateTableInterface(
        tableName
      );
      const tableSchema = await introspector.generateTableSchema(tableName);
      const tableRepo = await introspector.generateRepositoryFunctions(
        tableName
      );

      // Add to the types file
      typesContent += `    ${tableName}: ${tableInterface};\n`;

      // Add to the schemas file
      schemasContent += tableSchema;

      // Add to the repo file
      repoContent += tableRepo;
    } // Complete the types file
    typesContent += `  };
  Functions: Record<string, unknown>;
  Enums: {
`;

    // Add enum types to the Database type
    for (const [enumName, enumValues] of Object.entries(enumTypes)) {
      typesContent += `    ${enumName}: ${JSON.stringify(enumValues)};\n`;
    }

    typesContent += `  };
};
`;

    // Add repository factory
    repoContent += `
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
${tables.map((t) => `  ${t}: createRepository('${t}')`).join(",\n")}
};
`; // Write output files
    fs.writeFileSync(TYPES_OUTPUT, typesContent);
    fs.writeFileSync(SCHEMAS_OUTPUT, schemasContent);
    fs.writeFileSync(REPO_OUTPUT, repoContent);
    fs.writeFileSync(ENUMS_OUTPUT, enumsContent);

    console.log("✅ Successfully generated:");
    console.log(`- Types: ${TYPES_OUTPUT}`);
    console.log(`- Schemas: ${SCHEMAS_OUTPUT}`);
    console.log(`- Repository functions: ${REPO_OUTPUT}`);
    console.log(`- Enum types: ${ENUMS_OUTPUT}`);
  } catch (error) {
    console.error("❌ Error generating types:", error);
    process.exit(1);
  }
}

// Run the generator
generateTypes().catch(console.error);
