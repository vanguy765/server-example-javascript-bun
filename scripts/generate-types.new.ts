// filepath: c:\Users\3900X\Code\vapiordie3\vapiordie3\scripts\generate-types.ts
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Paths
const TYPES_PATH = path.join(__dirname, "../src/supabase/generated.types.ts");

async function generateTypes(specifiedProjectId?: string) {
  try {
    console.log(" Generating TypeScript types via Supabase CLI...");

    // Check for access token
    if (!process.env.SUPABASE_ACCESS_TOKEN) {
      console.error(" Missing SUPABASE_ACCESS_TOKEN environment variable.");
      console.log(
        "  Please add this to your .env file or set it in your environment."
      );
      console.log(
        "  You can get this token from https://app.supabase.io/account/tokens"
      );
      throw new Error("Missing SUPABASE_ACCESS_TOKEN");
    }

    let projectId = specifiedProjectId;

    // If no project ID is specified, try to get it from Supabase CLI
    if (!projectId) {
      // Get project ID from the Supabase projects list
      console.log("  Getting project ID from Supabase CLI...");
      const { stdout: projectsOutput } = await execAsync(
        `npx supabase projects list`
      );

      // Find the project ID - look for any project row in the output
      console.log("  Searching for project ID in CLI output...");

      // Look for the Reference ID in the table
      const projectMatch = projectsOutput.match(
        /│\s+([a-z0-9]+)\s+│\s+([a-z0-9]+)\s+│/
      );
      projectId = projectMatch?.[2];

      if (!projectId) {
        console.error(" Could not find project ID in the projects list output");
        console.log("  Raw output was:");
        console.log(projectsOutput);
        throw new Error("Project ID not found");
      }
    }

    console.log(`  Found project ID: ${projectId}`);
    console.log("  Generating TypeScript types...");

    // Generate types using the CLI and save to file
    console.log(
      `  Running command: npx supabase gen types typescript --project-id ${projectId}`
    );

    try {
      const { stdout } = await execAsync(
        `npx supabase gen types typescript --project-id ${projectId} --db-url ${
          process.env.SUPABASE_DB_URL ||
          "postgresql://postgres:postgres@localhost:5432/postgres"
        } ${process.env.SUPABASE_ACCESS_TOKEN ? `--access-token ${process.env.SUPABASE_ACCESS_TOKEN}` : ""}`
      );

      fs.writeFileSync(TYPES_PATH, stdout);

      console.log(" Types successfully generated and written to:");
      console.log(`   - ${TYPES_PATH}`);
    } catch (genError) {
      console.error(" Error generating types with Supabase CLI:");
      console.error(genError);
      throw new Error("Type generation failed");
    }
  } catch (error) {
    console.error(" Error generating types:", error);
    process.exit(1);
  }
}

// Process command line arguments
const args = process.argv.slice(2);
const projectIdArg = args.find((arg) => arg.startsWith("--project-id="));
const projectId = projectIdArg
  ? projectIdArg.split("=")[1]
  : process.env.SUPABASE_PROJECT_ID;

// Execute the function with optional project ID
if (projectId) {
  console.log(`Using specified project ID: ${projectId}`);
  generateTypes(projectId);
} else {
  generateTypes();
}
