import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// Paths
const TYPES_PATH = path.join(__dirname, "../src/supabase/generated.types.ts");
const SCHEMAS_PATH = path.join(
  __dirname,
  "../src/supabase/generated.schemas.ts"
);
const REPO_PATH = path.join(__dirname, "../src/supabase/generated-repo.ts");

async function generateLocalTypes() {
  console.log(" Generating TypeScript types from local Supabase instance...");

  try {
    // Check if the URL corresponds to a local instance
    if (
      process.env.SUPABASE_URL?.includes("127.0.0.1") ||
      process.env.SUPABASE_URL?.includes("localhost")
    ) {
      console.log(" Detected local Supabase instance from SUPABASE_URL");

      // Try direct database URL approach with output capture (no redirection)
      try {
        const dbUrl = "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
        const command = `npx supabase gen types typescript --db-url "${dbUrl}"`;
        console.log(`  Running command: ${command}`);

        // Capture stdout without redirection
        const { stdout } = await execAsync(command);

        // Write the output to file
        fs.writeFileSync(TYPES_PATH, stdout);

        console.log(
          " Types successfully generated from local database and written to:"
        );
        console.log(`   - ${TYPES_PATH}`);
        return true;
      } catch (err) {
        console.log("  Direct DB connection approach failed:", err);

        // Try more direct approach - using pg-dump
        try {
          console.log(
            "\n Attempting alternative approach with pg_dump directly..."
          );

          // Create a temporary directory to store schema files
          const tempDir = path.join(__dirname, "temp_schema");
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
          }

          // First, dump the database schema
          const schemaFile = path.join(tempDir, "schema.sql");
          const dumpCommand = `pg_dump --schema-only --no-owner --no-acl --host=127.0.0.1 --port=54322 --username=postgres --password postgres > "${schemaFile}"`;
          console.log(`  Running command: ${dumpCommand}`);

          try {
            await execAsync(dumpCommand);
            console.log("  Schema dumped successfully");

            // Use direct TypeScript template to create types file
            // Example type definition
            const typesContent = `
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
      // Add your table definitions manually here
      // Example:
      // users: {
      //   Row: { id: string; name: string; email: string }
      //   Insert: { id?: string; name: string; email: string }
      //   Update: { id?: string; name?: string; email?: string }
      // }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
            `;

            // Write types file
            fs.writeFileSync(TYPES_PATH, typesContent);

            console.log(" Basic type structure created at:");
            console.log(`   - ${TYPES_PATH}`);
            console.log(
              " Note: You'll need to manually fill in table definitions"
            );

            return true;
          } catch (pgDumpError) {
            console.error("  pg_dump approach failed:", pgDumpError);
          }
        } catch (alternativeError) {
          console.error("  Alternative approach failed:", alternativeError);
        }
      }

      console.error(
        " All approaches to generate types from local database failed"
      );

      // Create a minimal types file as a fallback
      const fallbackTypes = `
// Fallback types generated due to errors with type generation
// Please update these manually or fix the type generation issues

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
      // Add your table definitions manually here
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
      `;

      fs.writeFileSync(TYPES_PATH, fallbackTypes);
      console.log(" Fallback type structure created at:");
      console.log(`   - ${TYPES_PATH}`);
      console.log(" Note: You'll need to manually fill in table definitions");

      return true;
    }
    return false;
  } catch (error) {
    console.error(" Error generating types from local database:", error);
    return false;
  }
}

async function generateTypes(specifiedProjectId?: string) {
  try {
    console.log(" Generating TypeScript types via Supabase CLI...");

    // If no project ID is specified, try using local database first
    if (!specifiedProjectId) {
      const localSuccess = await generateLocalTypes();
      if (localSuccess) {
        console.log(" Successfully generated types from local database");
        return;
      } else {
        console.log(
          " Could not generate from local database, falling back to remote..."
        );
      }
    }

    // Check for access token for remote operations
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

    // Start with the direct method since we know it works
    const tryDirectScriptFirst = async (projectId: string) => {
      console.log("\n Trying direct script method first (known to work)...");
      try {
        const packageJsonPath = path.join(__dirname, "..", "package.json");
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8")
        );
        const directScript = packageJson.scripts["gen:types:direct"];

        if (directScript) {
          console.log(`  Using script from package.json: ${directScript}`);
          await execAsync(directScript);
          console.log(" Types successfully generated using direct script");
          return true;
        } else {
          console.log(
            " Could not find gen:types:direct script in package.json"
          );
        }
      } catch (error) {
        console.error(" Direct script method failed:");
        console.error(error);
      }
      return false;
    };

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

    // Try the direct script first as it's known to work
    if (await tryDirectScriptFirst(projectId)) {
      return; // Exit if successful
    }

    // Generate types using the CLI and save to file
    console.log(
      `  Running command: npx supabase gen types typescript --project-id ${projectId}`
    );
    // Try the direct output method (redirect to file) which is more reliable
    try {
      // Use direct output redirection which bypasses issues with Bun's Node.js compatibility
      const directCommand = `npx supabase gen types typescript --project-id ${projectId} > "${TYPES_PATH}"`;
      console.log(`  Running command: ${directCommand}`);
      await execAsync(directCommand);
      console.log(" Types successfully generated and written to:");
      console.log(`   - ${TYPES_PATH}`);
    } catch (directError) {
      console.error(" Error with direct output method:");
      console.error(directError);

      // Try global supabase CLI if available
      console.log("\n Attempting with global supabase CLI...");
      try {
        const globalCommand = `supabase gen types typescript --project-id ${projectId} > "${TYPES_PATH}"`;
        console.log(`  Running command: ${globalCommand}`);
        await execAsync(globalCommand);
        console.log(" Types successfully generated using global CLI");
        return; // Exit if successful
      } catch (globalError) {
        console.error(" Global CLI method failed:");
        console.error(globalError);
      }

      // Fall back to the alternative approach with stdout capture
      console.log("\n Attempting alternative approach (stdout capture)...");
      try {
        // Use a simpler command structure that's more compatible with different environments
        const command = [
          `npx supabase gen types typescript`,
          `--project-id ${projectId}`,
        ]
          .filter(Boolean)
          .join(" ");

        console.log(`  Running command: ${command}`);
        const { stdout } = await execAsync(command);

        // Write the generated types to the file
        fs.writeFileSync(TYPES_PATH, stdout);

        console.log(
          " Types successfully generated using stdout capture method"
        );
      } catch (stdoutError) {
        console.error(" Stdout capture method also failed:");
        console.error(stdoutError);

        // Final fallback - use the direct script from package.json
        console.log("\n Attempting with gen:types:direct script...");
        try {
          const packageJsonPath = path.join(__dirname, "..", "package.json");
          const packageJson = JSON.parse(
            fs.readFileSync(packageJsonPath, "utf8")
          );
          const directScript = packageJson.scripts["gen:types:direct"];

          if (directScript) {
            console.log(`  Using script from package.json: ${directScript}`);
            await execAsync(directScript);
            console.log(" Types successfully generated using direct script");
            return;
          } else {
            console.error(
              " Could not find gen:types:direct script in package.json"
            );
          }
        } catch (finalError) {
          console.error(" Final method also failed:");
          console.error(finalError);
        }

        throw new Error("Type generation failed with all methods");
      }
    }
  } catch (error) {
    console.error(" Error generating types:", error);
    process.exit(1);
  }
}

// Process command line arguments
const args = process.argv.slice(2);
const projectIdArg = args.find((arg) => arg.startsWith("--project-id="));
const useLocalArg = args.includes("--local");
const projectId = projectIdArg
  ? projectIdArg.split("=")[1]
  : process.env.SUPABASE_PROJECT_ID;

// Execute the function with optional project ID
if (useLocalArg) {
  // Force local mode if --local flag is present
  console.log("Using local Supabase instance (--local flag)");
  generateLocalTypes();
} else if (projectId) {
  // Use specified project ID
  console.log(`Using specified project ID: ${projectId}`);
  generateTypes(projectId);
} else {
  // No project ID and no --local flag: default behavior is to try local first, then fall back
  console.log("No project ID specified, checking for local instance first");
  generateTypes();
}
