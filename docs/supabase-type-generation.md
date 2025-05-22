# Generate Database Types

This document explains how to automatically generate TypeScript interfaces, types, and Zod schemas from your Supabase database.

## Method 1: Using Supabase CLI (Types Only)

1. First, make sure you have Supabase CLI installed:

   ```bash
   pnpm add -D supabase@latest
   ```

2. Connect to your Supabase project:

   ```bash
   npx supabase login
   ```

3. Set up Supabase local config (only once):

   ```bash
   npx supabase init
   ```

4. Generate TypeScript types from your database schema:

   ```bash
   npx supabase gen types typescript --project-id your-project-id --schema public > src/supabase/database.types.ts
   ```

5. You can then import and use these types:
   ```typescript
   import { Database } from "./database.types";
   type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
   ```

## Method 2: Using supabase-codegen-js tool (Types and Zod)

This tool generates both TypeScript types and Zod schemas:

1. Install the tool:

   ```bash
   pnpm add -D supabase-codegen-js
   ```

2. Create a generation script in your project:

```typescript
// scripts/generate-types.ts
import { createClient } from "@supabase/supabase-js";
import { generate } from "supabase-codegen-js";
import fs from "fs";
import path from "path";

async function generateTypes() {
  // Create Supabase client
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Generate types and schemas
  const { types, schemas } = await generate({
    supabaseClient: supabase,
    options: {
      includeTypes: true,
      includeZod: true,
    },
  });

  // Write TypeScript types
  fs.writeFileSync(
    path.join(__dirname, "../src/supabase/generated.types.ts"),
    types
  );

  // Write Zod schemas
  fs.writeFileSync(
    path.join(__dirname, "../src/supabase/generated.schemas.ts"),
    schemas
  );

  console.log("✅ Types and schemas generated successfully!");
}

generateTypes().catch(console.error);
```

3. Run the script:
   ```bash
   pnpm ts-node scripts/generate-types.ts
   ```

## Method 3: Using Zod Generator with Supabase Types

Alternatively, you can use Supabase types and generate Zod schemas from those:

1. First generate types with Supabase CLI (as in Method 1)

2. Install zod-prisma-types:

   ```bash
   pnpm add -D zod-prisma-types
   ```

3. Create a generator script:

```typescript
// scripts/generate-zod-schemas.ts
import { zodFromTs } from "zod-prisma-types";
import fs from "fs";
import path from "path";

// Read the generated types
const typesPath = path.join(__dirname, "../src/supabase/database.types.ts");
const typesContent = fs.readFileSync(typesPath, "utf-8");

// Generate Zod schemas from the types
const zodSchemas = zodFromTs(typesContent);

// Write Zod schemas
fs.writeFileSync(
  path.join(__dirname, "../src/supabase/generated.schemas.ts"),
  zodSchemas
);

console.log("✅ Zod schemas generated successfully!");
```

## Automating the Integration

Once you've generated the types and schemas, you can create a utility file to integrate them with your Repository Pattern:

```typescript
// src/supabase/generated.utils.ts
import { Database } from "./database.types";
import * as schemas from "./generated.schemas";

// Create typed helper functions
export function createTypedRepository<
  T extends keyof Database["public"]["Tables"]
>(tableName: T) {
  // The schema should match the table name
  const tableSchema = schemas[tableName];

  // Return repository functions that use the generated types and schemas
  return {
    getAll: async () => {
      // Implementation using generated types and schemas
    },
    // ... other repository methods
  };
}
```

## Adding to Package.json Scripts

Add a script to your package.json to make it easy to regenerate types:

```json
"scripts": {
  "gen:types": "supabase gen types typescript --project-id your-project-id > src/supabase/database.types.ts && ts-node scripts/generate-zod-schemas.ts"
}
```

Then you can run:

```bash
pnpm run gen:types
```

This will keep your types and schemas in sync with your database schema.
