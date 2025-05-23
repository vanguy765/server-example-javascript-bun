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
