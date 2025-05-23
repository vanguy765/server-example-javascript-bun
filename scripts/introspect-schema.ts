import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Zod Schema Generation Script from TypeScript Types
 *
 * This script generates Zod validation schemas from the existing
 * TypeScript types located in 'src/supabase/generated.types.ts'.
 * It uses the 'supabase-to-zod' utility.
 * It pre-processes the input types to replace problematic Arg types
 * and post-processes the output to fix import paths.
 */

// Define absolute paths for fs operations within the script
const projectRoot = path.join(__dirname, ".."); // Assuming scripts is one level down from project root
const TYPES_INPUT_ABS_PATH = path.join(
  projectRoot,
  "src/supabase/generated.types.ts"
);
const TEMP_TYPES_INPUT_ABS_PATH = path.join(
  projectRoot,
  "src/supabase/generated.types.temp.ts"
);
const SCHEMAS_OUTPUT_ABS_PATH = path.join(
  projectRoot,
  "src/supabase/generated.schemas.ts"
);

// Define relative paths for the CLI command (relative to projectRoot)
const TEMP_TYPES_INPUT_RELATIVE_PATH = "src/supabase/generated.types.temp.ts";
const SCHEMAS_OUTPUT_RELATIVE_PATH = "src/supabase/generated.schemas.ts";

async function generateZodSchemasFromTypes() {
  console.log("🚀 Starting Zod schema generation from TypeScript types...");

  if (!fs.existsSync(TYPES_INPUT_ABS_PATH)) {
    console.error(
      `❌ Original TypeScript types file not found at: ${TYPES_INPUT_ABS_PATH}`
    );
    console.log(
      "  Please ensure 'generated.types.ts' exists, possibly by running 'pnpm gen:types:direct' or a similar script."
    );
    process.exit(1);
  }

  try {
    // 1. Pre-process the input file
    console.log(
      `  Pre-processing TypeScript types from: ${TYPES_INPUT_ABS_PATH}`
    );
    let typesContent = fs.readFileSync(TYPES_INPUT_ABS_PATH, "utf8");

    // Replace 'Args: Record<PropertyKey, never>' with 'Args: {}'
    const problematicArgsRegex = /Args:\s*Record<PropertyKey,\s*never>/g;
    const originalContent = typesContent;
    typesContent = typesContent.replace(problematicArgsRegex, "Args: {}");

    if (typesContent !== originalContent) {
      console.log(
        "    ✅ Replaced 'Args: Record<PropertyKey, never>' with 'Args: {}'."
      );
    } else {
      console.warn(
        "    ⚠️ No 'Args: Record<PropertyKey, never>' found to replace. Proceeding with original content for temp file."
      );
    }

    fs.writeFileSync(TEMP_TYPES_INPUT_ABS_PATH, typesContent);
    console.log(
      `    Temporary pre-processed types file created: ${TEMP_TYPES_INPUT_ABS_PATH}`
    );

    console.log(`  Output Zod schemas (absolute): ${SCHEMAS_OUTPUT_ABS_PATH}`);

    // 2. Run supabase-to-zod
    const command = `npx supabase-to-zod --input "${TEMP_TYPES_INPUT_RELATIVE_PATH}" --output "${SCHEMAS_OUTPUT_RELATIVE_PATH}"`;

    console.log(`  Executing: ${command}`);
    const { stdout, stderr } = await execAsync(command, { cwd: projectRoot });

    if (stderr) {
      if (
        stderr.toLowerCase().includes("error") &&
        !stderr.toLowerCase().includes("some schemas can't be generated")
      ) {
        // Ignore the "Some schemas can't be generated" if it's the only error, as we are trying to work around it.
        console.error("❌ Errors during Zod schema generation:");
        console.error(stderr);
      } else {
        console.warn("⚠️ supabase-to-zod output (stderr):");
        console.warn(stderr);
      }
    }

    if (stdout) {
      console.log("  supabase-to-zod output (stdout):");
      console.log(stdout);
    }

    // 3. Post-process the generated schemas file
    if (fs.existsSync(SCHEMAS_OUTPUT_ABS_PATH)) {
      console.log(
        `  Post-processing Zod schema file: ${SCHEMAS_OUTPUT_ABS_PATH}`
      );
      let schemasFileContent = fs.readFileSync(SCHEMAS_OUTPUT_ABS_PATH, "utf8");
      const importRegex = /from\s+['"]\.\/generated\.types\.temp['"]/g;
      const originalSchemasContent = schemasFileContent;
      schemasFileContent = schemasFileContent.replace(
        importRegex,
        'from "./generated.types"'
      );

      if (schemasFileContent !== originalSchemasContent) {
        fs.writeFileSync(SCHEMAS_OUTPUT_ABS_PATH, schemasFileContent);
        console.log("    ✅ Corrected import paths in generated.schemas.ts.");
      } else {
        console.warn(
          "    ⚠️ No import paths from '.generated.types.temp' found to correct."
        );
      }

      const stats = fs.statSync(SCHEMAS_OUTPUT_ABS_PATH);
      if (stats.size > 0) {
        console.log(
          `✅ Successfully generated and processed Zod schemas: ${SCHEMAS_OUTPUT_ABS_PATH}`
        );
      } else {
        console.error(
          `❌ Zod schema file was created but is empty: ${SCHEMAS_OUTPUT_ABS_PATH}`
        );
      }
    } else {
      console.error(
        `❌ Zod schema file was not created at: ${SCHEMAS_OUTPUT_ABS_PATH}`
      );
      throw new Error("Zod schema generation failed to create output file.");
    }
  } catch (error: any) {
    console.error("❌ Error executing Zod schema generation command:");
    if (error.stdout) console.error("Stdout:", error.stdout);
    if (error.stderr) console.error("Stderr:", error.stderr);
    if (error.message) console.error("Message:", error.message);
    process.exit(1);
  } finally {
    // 4. Clean up the temporary file
    if (fs.existsSync(TEMP_TYPES_INPUT_ABS_PATH)) {
      fs.unlinkSync(TEMP_TYPES_INPUT_ABS_PATH);
      console.log(`  Temporary file deleted: ${TEMP_TYPES_INPUT_ABS_PATH}`);
    }
  }
}

// Run the generator
generateZodSchemasFromTypes().catch((error) => {
  console.error("Unhandled error in script:", error);
  process.exit(1);
});

// Removed old functions:
// - generateTypes (old main function)
// - generateTypesWithIntrospection (relied on SchemaIntrospector)
// - generateEmptyFiles (less relevant now, supabase-to-zod handles errors)
// - generateTypesWithCli (was for TypeScript types, not Zod from types)
