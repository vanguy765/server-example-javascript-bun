/**
 * Setup script for the Supabase Schema MCP Server
 * This script helps deploy the SQL functions and start the MCP server
 */

import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";

const execAsync = promisify(exec);

// Function to handle command execution with output display
async function runCommand(command: string, description: string) {
  console.log(`\n📌 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    return { success: true, output: stdout };
  } catch (error: any) {
    console.error(`❌ Error: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return { success: false, error };
  }
}

// Main function to run setup steps
async function setup() {
  console.log("🚀 Setting up Supabase Schema MCP Server...");

  // Install required packages if they're not already installed
  await runCommand(
    "npm install --no-save hono @hono/node-server",
    "Installing required packages"
  );

  // Check if Supabase CLI is installed
  const cliResult = await runCommand(
    "npx supabase --version",
    "Checking Supabase CLI"
  );

  if (!cliResult.success) {
    console.log("Installing Supabase CLI...");
    await runCommand(
      "npm install -g supabase",
      "Installing Supabase CLI globally"
    );
  }

  // Check if we're linked to a Supabase project
  const linkCheckResult = await runCommand(
    "npx supabase status",
    "Checking project status"
  );

  // If there's no linked project, offer to link one
  if (!linkCheckResult.success) {
    console.log(
      "\n❓ No Supabase project is linked. Do you want to link an existing project?"
    );
    console.log("   Run the following commands manually:");
    console.log("   1. npx supabase login");
    console.log("   2. npx supabase link --project-ref YOUR_PROJECT_ID");
    console.log(
      "\n   You can find your project ID in the Supabase dashboard or by running:"
    );
    console.log("   npx supabase projects list");
  } else {
    // Offer to deploy the SQL functions
    console.log(
      "\n❓ Do you want to deploy the SQL functions to your Supabase project?"
    );
    console.log(
      "   These are needed for the MCP server to access schema information."
    );
    console.log("   Run the following command manually:");
    console.log(
      "   npx supabase db push --file ./scripts/schema-functions.sql"
    );
  }

  // Offer to start the MCP server
  console.log("\n✅ Setup complete!");
  console.log("\nTo start the MCP server, run:");
  console.log("npx tsx ./scripts/mcp-schema-server.ts");
}

// Run the setup
setup().catch(console.error);
