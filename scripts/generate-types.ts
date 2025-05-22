import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { createClient } from "@supabase/supabase-js";
import { envConfig } from "../src/config/env.config";
import { convertToZod } from "supabase-to-zod";

const execAsync = promisify(exec);

// Paths
const TYPES_PATH = path.join(__dirname, "../src/supabase/generated.types.ts");
const SCHEMAS_PATH = path.join(
  __dirname,
  "../src/supabase/generated.schemas.ts"
);
const REPOSITORY_PATH = path.join(
  __dirname,
  "../src/supabase/generated-repo.ts"
);

async function generateTypes() {
  try {
    console.log("🔍 Connecting to Supabase...");

    // Create Supabase client
    const supabase = createClient(
      envConfig.supabase.url,
      envConfig.supabase.key
    );

    // Generate Supabase types using the CLI
    console.log("📝 Generating TypeScript types...");

    try {
      // First approach: using supabase CLI
      const projectIdCmd = `npx supabase projects list --access-token ${process.env.SUPABASE_ACCESS_TOKEN}`;
      console.log("  Getting project ID...");

      const { stdout: projectsOutput } = await execAsync(projectIdCmd);
      const projectId = projectsOutput.match(
        /([a-z0-9-]+)\s+\|\s+your-project-name/
      )?.[1];

      if (!projectId) {
        throw new Error(
          "Could not find project ID, will use alternative approach"
        );
      }

      const genTypesCmd = `npx supabase gen types typescript --project-id ${projectId} > ${TYPES_PATH}`;
      await execAsync(genTypesCmd);
    } catch (cliError) {
      // Alternative approach: using database schema introspection
      console.log("  Using database introspection instead...");
      console.log("  Fetching database schema...");

      // Fetch schema information
      const { data: tables, error } = await supabase
        .from("pg_tables")
        .select("*")
        .eq("schemaname", "public");

      if (error) throw new Error(`Error fetching tables: ${error.message}`);

      // Generate simple types from schema
      let typesCode = `// Auto-generated types from Supabase schema\n\n`;
      typesCode += `export type Database = {\n`;
      typesCode += `  public: {\n`;
      typesCode += `    Tables: {\n`;

      for (const table of tables) {
        const { data: columns, error: columnsError } = await supabase
          .from("information_schema.columns")
          .select("*")
          .eq("table_schema", "public")
          .eq("table_name", table.tablename);

        if (columnsError)
          throw new Error(`Error fetching columns: ${columnsError.message}`);

        typesCode += `      ${table.tablename}: {\n`;
        typesCode += `        Row: {\n`;

        for (const column of columns) {
          const tsType = mapPgTypeToTs(
            column.data_type,
            column.is_nullable === "YES"
          );
          typesCode += `          ${column.column_name}: ${tsType};\n`;
        }

        typesCode += `        };\n`;
        typesCode += `        Insert: {\n`;

        for (const column of columns) {
          const tsType = mapPgTypeToTs(
            column.data_type,
            column.is_nullable === "YES"
          );
          const isGenerated = ["id", "created_at", "updated_at"].includes(
            column.column_name
          );
          typesCode += `          ${column.column_name}${
            isGenerated ? "?" : ""
          }: ${tsType};\n`;
        }

        typesCode += `        };\n`;
        typesCode += `        Update: {\n`;

        for (const column of columns) {
          const tsType = mapPgTypeToTs(
            column.data_type,
            column.is_nullable === "YES"
          );
          typesCode += `          ${column.column_name}?: ${tsType};\n`;
        }

        typesCode += `        };\n`;
        typesCode += `      };\n`;
      }

      typesCode += `    };\n`;
      typesCode += `  };\n`;
      typesCode += `};\n\n`;

      // Include convenience types
      for (const table of tables) {
        typesCode += `export type ${pascalCase(
          table.tablename
        )} = Database['public']['Tables']['${table.tablename}']['Row'];\n`;
        typesCode += `export type Insert${pascalCase(
          table.tablename
        )} = Database['public']['Tables']['${table.tablename}']['Insert'];\n`;
        typesCode += `export type Update${pascalCase(
          table.tablename
        )} = Database['public']['Tables']['${table.tablename}']['Update'];\n\n`;
      }

      fs.writeFileSync(TYPES_PATH, typesCode);
    }

    console.log("✅ TypeScript types generated successfully!");

    // Generate Zod schemas
    console.log("📝 Generating Zod schemas...");

    // Read the generated types
    const typesContent = fs.readFileSync(TYPES_PATH, "utf-8");

    // Convert types to Zod schemas
    const zodSchemas = convertToZod(typesContent);

    fs.writeFileSync(SCHEMAS_PATH, zodSchemas);
    console.log("✅ Zod schemas generated successfully!");

    // Generate repository boilerplate
    console.log("📝 Generating repository helpers...");
    generateRepositoryHelpers();
    console.log("✅ Repository helpers generated successfully!");

    console.log("🎉 All done! Generated files:");
    console.log(`   - ${TYPES_PATH}`);
    console.log(`   - ${SCHEMAS_PATH}`);
    console.log(`   - ${REPOSITORY_PATH}`);
  } catch (error) {
    console.error("❌ Error generating types:", error);
    process.exit(1);
  }
}

function generateRepositoryHelpers() {
  // Read the generated types
  const typesContent = fs.readFileSync(TYPES_PATH, "utf-8");

  // Extract table names
  const tableRegex = /(\w+): {/g;
  const tableMatches = [...typesContent.matchAll(tableRegex)];
  const tableNames = tableMatches
    .map((match) => match[1])
    .filter(
      (name) =>
        !name.includes("Row") &&
        !name.includes("Insert") &&
        !name.includes("Update")
    );

  // Generate repository helpers
  let repoCode = `// Auto-generated repository helpers\n\n`;
  repoCode += `import { supabaseClient } from './client';\n`;
  repoCode += `import { Database } from './generated.types';\n`;
  repoCode += `import * as schemas from './generated.schemas';\n\n`;

  repoCode += `/**\n`;
  repoCode += ` * Create a typed repository for a specific table\n`;
  repoCode += ` * @param tableName The name of the table\n`;
  repoCode += ` */\n`;
  repoCode += `export function createRepository<T extends keyof Database['public']['Tables']>(\n`;
  repoCode += `  tableName: T\n`;
  repoCode += `) {\n`;
  repoCode += `  type Row = Database['public']['Tables'][T]['Row'];\n`;
  repoCode += `  type Insert = Database['public']['Tables'][T]['Insert'];\n`;
  repoCode += `  type Update = Database['public']['Tables'][T]['Update'];\n\n`;

  repoCode += `  return {\n`;
  repoCode += `    async getAll(): Promise<Row[]> {\n`;
  repoCode += `      const { data, error } = await supabaseClient.from(tableName).select('*');\n`;
  repoCode += `      if (error) throw error;\n`;
  repoCode += `      return data as Row[];\n`;
  repoCode += `    },\n\n`;

  repoCode += `    async getById(id: string): Promise<Row | null> {\n`;
  repoCode += `      const { data, error } = await supabaseClient\n`;
  repoCode += `        .from(tableName)\n`;
  repoCode += `        .select('*')\n`;
  repoCode += `        .eq('id', id)\n`;
  repoCode += `        .single();\n\n`;

  repoCode += `      if (error) {\n`;
  repoCode += `        if (error.code === 'PGRST116') return null;\n`;
  repoCode += `        throw error;\n`;
  repoCode += `      }\n\n`;

  repoCode += `      return data as Row;\n`;
  repoCode += `    },\n\n`;

  repoCode += `    async create(data: Insert): Promise<Row> {\n`;
  repoCode += `      // Validate with schema if available\n`;
  repoCode += `      if (schemas[tableName + 'InsertSchema']) {\n`;
  repoCode += `        schemas[tableName + 'InsertSchema'].parse(data);\n`;
  repoCode += `      }\n\n`;

  repoCode += `      const { data: result, error } = await supabaseClient\n`;
  repoCode += `        .from(tableName)\n`;
  repoCode += `        .insert(data)\n`;
  repoCode += `        .select()\n`;
  repoCode += `        .single();\n\n`;

  repoCode += `      if (error) throw error;\n`;
  repoCode += `      return result as Row;\n`;
  repoCode += `    },\n\n`;

  repoCode += `    async update(id: string, data: Update): Promise<Row> {\n`;
  repoCode += `      // Validate with schema if available\n`;
  repoCode += `      if (schemas[tableName + 'UpdateSchema']) {\n`;
  repoCode += `        schemas[tableName + 'UpdateSchema'].parse(data);\n`;
  repoCode += `      }\n\n`;

  repoCode += `      const { data: result, error } = await supabaseClient\n`;
  repoCode += `        .from(tableName)\n`;
  repoCode += `        .update(data)\n`;
  repoCode += `        .eq('id', id)\n`;
  repoCode += `        .select()\n`;
  repoCode += `        .single();\n\n`;

  repoCode += `      if (error) throw error;\n`;
  repoCode += `      return result as Row;\n`;
  repoCode += `    },\n\n`;

  repoCode += `    async delete(id: string): Promise<void> {\n`;
  repoCode += `      const { error } = await supabaseClient\n`;
  repoCode += `        .from(tableName)\n`;
  repoCode += `        .delete()\n`;
  repoCode += `        .eq('id', id);\n\n`;

  repoCode += `      if (error) throw error;\n`;
  repoCode += `    },\n`;
  repoCode += `  };\n`;
  repoCode += `}\n\n`;

  // Add pre-generated repositories for all tables
  repoCode += `/**\n`;
  repoCode += ` * Pre-generated repositories for all tables\n`;
  repoCode += ` */\n`;
  repoCode += `export const repositories = {\n`;

  for (const table of tableNames) {
    const pascalTable = pascalCase(table);
    repoCode += `  ${table}: createRepository('${table}'),\n`;
  }

  repoCode += `};\n`;

  fs.writeFileSync(REPOSITORY_PATH, repoCode);
}

// Helper function to map PostgreSQL types to TypeScript types
function mapPgTypeToTs(pgType: string, isNullable: boolean): string {
  const nullable = isNullable ? " | null" : "";
  switch (pgType.toLowerCase()) {
    case "integer":
    case "numeric":
    case "decimal":
    case "real":
    case "double precision":
    case "smallint":
    case "bigint":
      return `number${nullable}`;
    case "boolean":
      return `boolean${nullable}`;
    case "json":
    case "jsonb":
      return `Record<string, any>${nullable}`;
    case "timestamp with time zone":
    case "timestamp without time zone":
    case "date":
    case "time":
      return `string${nullable}`;
    case "uuid":
    case "text":
    case "varchar":
    case "character varying":
    default:
      return `string${nullable}`;
  }
}

// Helper function to convert snake_case to PascalCase
function pascalCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Run the generator
generateTypes();
