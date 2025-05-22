/**
 * Example demonstrating how to query database schema information through the Supabase API
 * and generate types and schemas automatically.
 */
import { createClient } from "@supabase/supabase-js";
import { SchemaIntrospector } from "../src/supabase/schema-introspector";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
dotenv.config();

async function queryAndAnalyzeSchema() {
  console.log("🔍 Querying database schema information using Supabase API...");

  // Get credentials from environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
    );
    return;
  }

  try {
    // Create an instance of the SchemaIntrospector
    const introspector = new SchemaIntrospector(supabaseUrl, supabaseKey);

    // Get list of tables
    const tables = await introspector.getTables();
    console.log(`📊 Found ${tables.length} tables: ${tables.join(", ")}`);

    // Create a report directory
    const reportDir = path.join(__dirname, "schema-report");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }

    // Process each table
    for (const tableName of tables) {
      console.log(`\n📋 Analyzing table: ${tableName}`);

      // Get table columns
      const columns = await introspector.getTableColumns(tableName);
      console.log(`  - Found ${columns.length} columns`);

      // Get primary keys
      const primaryKeys = await introspector.getPrimaryKeys(tableName);
      console.log(`  - Primary keys: ${primaryKeys.join(", ") || "none"}`);

      // Generate TypeScript interface
      const interfaceText = await introspector.generateTableInterface(
        tableName
      );
      console.log(`\n📝 Generated TypeScript interface:`);
      console.log(interfaceText);

      // Generate Zod schema
      const schemaText = await introspector.generateTableSchema(tableName);
      console.log(`\n📝 Generated Zod schema:`);
      console.log(schemaText);

      // Write reports to files
      fs.writeFileSync(
        path.join(reportDir, `${tableName}.json`),
        JSON.stringify(
          {
            columns,
            primaryKeys,
            interface: interfaceText,
            schema: schemaText,
          },
          null,
          2
        )
      );
    }

    // Get enum types
    const enums = await introspector.getEnumTypes();
    console.log("\n📊 Found enum types:");
    for (const [name, values] of Object.entries(enums)) {
      console.log(`  - ${name}: ${values.join(", ")}`);
    }

    console.log(`\n✅ Schema analysis complete. Reports saved to ${reportDir}`);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

queryAndAnalyzeSchema();
