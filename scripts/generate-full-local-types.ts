import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { generateAllTypesFromSchema } from "./enhanced-type-generator";

const execAsync = promisify(exec);

// Paths
const SCHEMA_SQL_PATH = path.join(__dirname, "../src/supabase/schema.sql");

async function runFullLocalTypeGeneration() {
  try {
    console.log("=== Running Enhanced Local Type Generation Workflow ===");

    // Step 1: Dump schema from PostgreSQL
    console.log("\n📋 Step 1: Dumping database schema...");
    const pgDumpCommand = `pg_dump --schema-only --no-owner --no-acl -f "${SCHEMA_SQL_PATH}" -h 127.0.0.1 -p 54322 -U postgres postgres`;
    console.log(`Running: ${pgDumpCommand}`);

    let schemaExists = false;
    try {
      await execAsync(pgDumpCommand);
      console.log(`✅ Schema successfully dumped to: ${SCHEMA_SQL_PATH}`);
      schemaExists = true;
    } catch (dumpError) {
      console.error("❌ Error dumping schema:", dumpError);
      console.log("\nChecking if existing schema file is available...");

      if (fs.existsSync(SCHEMA_SQL_PATH)) {
        console.log(`✅ Found existing schema file at: ${SCHEMA_SQL_PATH}`);
        schemaExists = true;
      } else {
        console.error(
          "❌ No schema file found. Make sure your local Supabase instance is running."
        );
        console.error("   Try running: supabase start");
        process.exit(1);
      }
    }

    if (!schemaExists) {
      console.error("❌ Cannot proceed without a schema file.");
      process.exit(1);
    }

    // Step 2: Generate types from schema using enhanced generator
    console.log("\n📝 Step 2: Generating types from schema...");

    try {
      await generateAllTypesFromSchema(SCHEMA_SQL_PATH);
      console.log("✅ Types successfully generated from schema!");
    } catch (genTypesError) {
      console.error("❌ Error generating types:", genTypesError);
      process.exit(1);
    }

    console.log("\n✨ Enhanced type generation workflow complete! ✨");
    console.log("\nGenerated files:");
    console.log("  - src/supabase/schema.sql - Raw PostgreSQL schema");
    console.log("  - src/supabase/generated.types.ts - TypeScript types");
    console.log(
      "  - src/supabase/generated.schemas.ts - Zod validation schemas"
    );
    console.log(
      "  - src/supabase/generated-repo.ts - Repository pattern helpers"
    );
    console.log(
      "  - src/supabase/generated.enums.ts - TypeScript enum definitions (if enums exist)"
    );
  } catch (error) {
    console.error("Error in type generation workflow:", error);
    process.exit(1);
  }
}

// Run the workflow
runFullLocalTypeGeneration();
