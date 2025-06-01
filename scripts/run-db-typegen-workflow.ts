#!/usr/bin/env bun
/**
 * Complete workflow script for type generation and schema analysis
 * This script:
 * 1. Dumps the current schema from the local Supabase instance
 * 2. Generates TypeScript types, Zod schemas, and repository helpers
 * 3. Generates detailed schema documentation
 * 4. Prints a validation report
 */

import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { generateAllTypesFromSchema } from "./enhanced-type-generator";
import { analyzeSchema } from "./enhanced-schema-analyzer";
import { parseSchemaFile } from "./enhanced-schema-parser";

const execAsync = promisify(exec);

// Paths
const SCHEMA_SQL_PATH = path.join(__dirname, "../src/supabase/schema.sql");
const TYPES_PATH = path.join(__dirname, "../src/supabase/generated.types.ts");
const SCHEMAS_PATH = path.join(
  __dirname,
  "../src/supabase/generated.schemas.ts"
);
const REPO_PATH = path.join(__dirname, "../src/supabase/generated-repo.ts");
const ENUMS_PATH = path.join(__dirname, "../src/supabase/generated.enums.ts");
const SCHEMA_ANALYSIS_PATH = path.join(
  __dirname,
  "../docs/auto-generated-types.md"
);

// ANSI color codes for output formatting
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  bgBlack: "\x1b[40m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
  bgCyan: "\x1b[46m",
  bgWhite: "\x1b[47m",
};

/**
 * Check if a file exists and has content
 */
function fileExistsWithContent(filePath: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const stats = fs.statSync(filePath);
  return stats.isFile() && stats.size > 0;
}

/**
 * Run the complete workflow
 */
async function runWorkflow() {
  console.log(
    "\n" +
      colors.bgBlue +
      colors.white +
      colors.bright +
      " 🚀 Starting Complete DB Type Generation Workflow " +
      colors.reset +
      "\n"
  );

  try {
    // Check if Supabase is running locally
    console.log(
      colors.cyan + "🔍 Checking local Supabase instance..." + colors.reset
    );
    try {
      await execAsync("supabase status");
      console.log(
        colors.green + "✅ Local Supabase instance is running" + colors.reset
      );
    } catch (error) {
      console.log(
        colors.yellow +
          "⚠️ Unable to verify Supabase status. Proceeding anyway..." +
          colors.reset
      );
      console.log(
        "   If you encounter errors, make sure local Supabase is running with: supabase start"
      );
    }

    // Step 1: Dump schema from PostgreSQL
    console.log(
      "\n" +
        colors.cyan +
        "📋 Step 1: Dumping database schema..." +
        colors.reset
    );
    const pgDumpCommand = `pg_dump --schema-only --no-owner --no-acl -f "${SCHEMA_SQL_PATH}" -h 127.0.0.1 -p 54322 -U postgres postgres`;
    console.log(`Running: ${pgDumpCommand}`);

    let schemaExists = false;
    try {
      await execAsync(pgDumpCommand);
      console.log(
        colors.green +
          `✅ Schema successfully dumped to: ${SCHEMA_SQL_PATH}` +
          colors.reset
      );
      schemaExists = true;
    } catch (dumpError) {
      console.log(colors.yellow + "⚠️ Error dumping schema:" + colors.reset);
      console.log(dumpError);

      console.log("\nChecking if existing schema file is available...");
      if (fs.existsSync(SCHEMA_SQL_PATH)) {
        console.log(
          colors.green +
            `✅ Found existing schema file at: ${SCHEMA_SQL_PATH}` +
            colors.reset
        );
        schemaExists = true;
      } else {
        console.log(colors.red + "❌ No schema file found." + colors.reset);
        console.log(
          "   Make sure your local Supabase instance is running with: supabase start"
        );
        process.exit(1);
      }
    }

    // Step 2: Parse schema to check structure
    console.log(
      "\n" +
        colors.cyan +
        "🔍 Step 2: Parsing schema structure..." +
        colors.reset
    );
    const schema = parseSchemaFile(SCHEMA_SQL_PATH);
    const publicTables = schema.tables.filter((t) => t.schema === "public");
    const publicEnums = schema.enums.filter((e) => e.schema === "public");

    console.log(
      `Found ${colors.green}${publicTables.length}${colors.reset} tables in public schema:`
    );
    for (const table of publicTables) {
      console.log(
        `  - ${colors.green}${table.name}${colors.reset} (${table.columns.length} columns)`
      );
    }

    if (publicEnums.length > 0) {
      console.log(
        `Found ${colors.green}${publicEnums.length}${colors.reset} enum types in public schema:`
      );
      for (const enumType of publicEnums) {
        console.log(
          `  - ${colors.green}${enumType.name}${colors.reset} (${enumType.values.length} values)`
        );
      }
    }

    // Step 3: Generate types from schema
    console.log(
      "\n" +
        colors.cyan +
        "🛠️ Step 3: Generating TypeScript types and schemas..." +
        colors.reset
    );

    try {
      await generateAllTypesFromSchema(SCHEMA_SQL_PATH);
      console.log(
        colors.green + "✅ Type generation successful!" + colors.reset
      );
    } catch (genError) {
      console.log(colors.red + "❌ Error generating types:" + colors.reset);
      console.log(genError);
      process.exit(1);
    }

    // Step 4: Generate schema documentation
    console.log(
      "\n" +
        colors.cyan +
        "📝 Step 4: Generating schema documentation..." +
        colors.reset
    );

    try {
      await analyzeSchema();
      console.log(
        colors.green +
          `✅ Schema documentation written to: ${SCHEMA_ANALYSIS_PATH}` +
          colors.reset
      );
    } catch (analyzeError) {
      console.log(
        colors.red + "❌ Error generating schema documentation:" + colors.reset
      );
      console.log(analyzeError);
    }

    // Final validation
    console.log(
      "\n" +
        colors.cyan +
        "🧪 Step 5: Validating output files..." +
        colors.reset
    );

    const validation = [
      { file: SCHEMA_SQL_PATH, description: "Schema SQL file" },
      { file: TYPES_PATH, description: "TypeScript types" },
      { file: SCHEMAS_PATH, description: "Zod schemas" },
      { file: REPO_PATH, description: "Repository helpers" },
      { file: SCHEMA_ANALYSIS_PATH, description: "Schema documentation" },
    ];

    if (publicEnums.length > 0) {
      validation.push({ file: ENUMS_PATH, description: "Enum definitions" });
    }

    let allValid = true;
    for (const item of validation) {
      const exists = fileExistsWithContent(item.file);
      if (exists) {
        console.log(
          `${colors.green}✅ ${item.description}${
            colors.reset
          } - ${path.basename(item.file)}`
        );
      } else {
        console.log(
          `${colors.red}❌ ${item.description}${colors.reset} - ${path.basename(
            item.file
          )} (missing or empty)`
        );
        allValid = false;
      }
    }

    // Final summary
    console.log(
      "\n" +
        colors.bgGreen +
        colors.black +
        colors.bright +
        " ✨ Workflow Complete! " +
        colors.reset
    );

    if (allValid) {
      console.log(
        "\n" +
          colors.green +
          "All files were successfully generated. Your database types are ready to use!" +
          colors.reset
      );
    } else {
      console.log(
        "\n" +
          colors.yellow +
          "Some files may be missing or empty. Review the errors above." +
          colors.reset
      );
    }

    console.log("\n" + colors.cyan + "Quick usage examples:" + colors.reset);
    console.log(`
1. Import types in your code:
   ${colors.dim}import { Database } from './src/supabase/generated.types';${colors.reset}

2. Use with Supabase client:
   ${colors.dim}const supabase = createClient<Database>(url, key);${colors.reset}

3. Use Zod schemas for validation:
   ${colors.dim}import { UserSchema } from './src/supabase/generated.schemas';${colors.reset}

4. Use repositories pattern:
   ${colors.dim}import { createUserRepository } from './src/supabase/generated-repo';${colors.reset}

📝 Full documentation available in: docs/auto-generated-types.md
`);
  } catch (error) {
    console.log(
      colors.bgRed + colors.white + " Error in workflow: " + colors.reset
    );
    console.log(error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  runWorkflow();
}
