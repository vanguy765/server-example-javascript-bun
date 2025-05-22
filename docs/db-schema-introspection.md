# Direct Database Schema Introspection

This guide explains how to directly query your Supabase database schema through the Supabase API to generate TypeScript types and Zod validation schemas automatically.

## Overview

Instead of relying on the Supabase CLI or external tools, this approach uses the Supabase JavaScript client to query the PostgreSQL system tables directly. This allows you to:

1. Generate TypeScript types from your database schema
2. Create Zod validation schemas for each table
3. Build typed repository functions
4. All without requiring CLI installation or additional dependencies

## Getting Started

### Prerequisites

You need to set up the following environment variables:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key (or service role key for more permissions)

### Running the Scripts

The project includes several scripts to help you work with your database schema:

```bash
# Generate types and schemas using the introspection script
pnpm run gen:schema-types

# Analyze the database schema and create a detailed report
pnpm run analyze:schema
```

## How It Works

1. The `SchemaIntrospector` class connects to your Supabase project and queries the PostgreSQL system tables:

   - `information_schema.tables` - For table information
   - `information_schema.columns` - For column details
   - `information_schema.key_column_usage` - For primary key information
   - `pg_type` and `pg_enum` - For enumerated types

2. This data is then transformed into:

   - TypeScript interfaces that match your table structures
   - Zod validation schemas with appropriate types and validations
   - Repository pattern functions for basic CRUD operations

3. The generated files are saved to:
   - `src/supabase/generated.types.ts` - TypeScript interfaces for tables
   - `src/supabase/generated.schemas.ts` - Zod validation schemas
   - `src/supabase/generated-repo.ts` - Repository pattern functions
   - `src/supabase/generated.enums.ts` - PostgreSQL enum types as TypeScript enums

## Using The Generated Code

### Import Types

```typescript
// Import types
import { Database, Tenant } from "../supabase/generated.types";

// Type-safe database access
const tenant: Tenant = {
  id: "123",
  name: "Acme Corp",
  // ...other fields
};
```

### Use Validation Schemas

```typescript
// Import schemas
import {
  tenantSchema,
  tenantInsertSchema,
} from "../supabase/generated.schemas";

// Validate data
try {
  const validData = tenantInsertSchema.parse({
    name: "New Tenant",
    contact_email: "contact@example.com",
  });
  // Data is valid, proceed with database operation
} catch (error) {
  // Handle validation errors
  console.error("Validation failed:", error);
}
```

### Use Repository Functions

```typescript
// Import repository functions
import { repositories } from "../supabase/generated-repo";

// Use the pre-generated repository
async function getTenants() {
  const tenants = await repositories.tenants.getAll();
  return tenants;
}

// Create a new product
async function createProduct(product) {
  return await productRepo.create(product);
}

// Get a product by ID
async function getProductById(id) {
  return await productRepo.getById(id);
}
```

### Use Generated Enum Types

```typescript
// Import enum types
import {
  UserRole,
  userRoleSchema,
  UserRoleType,
} from "../supabase/generated.enums";

// Use TypeScript enum for type safety
function isAdmin(role: UserRole): boolean {
  return role === UserRole.Admin;
}

// Use Zod schema for validation
function validateRole(input: unknown): UserRoleType {
  return userRoleSchema.parse(input);
}

// Get all possible values
function getAllRoles(): string[] {
  return Object.values(UserRole);
}
```

## Benefits Over Supabase CLI Approach

- **No CLI Required**: Works entirely through the JavaScript API
- **Easy Integration**: Can be run in any environment that can execute JavaScript
- **Comprehensive**: Generates not just types but also validation schemas and repository functions
- **Customizable**: The code generation can be easily modified to suit your specific needs

## Customizing the Generator

You can customize the generation process by modifying the `SchemaIntrospector` class in `src/supabase/schema-introspector.ts`:

- Add custom mapping for PostgreSQL types to TypeScript types
- Customize Zod validation rules based on column names or types
- Add additional repository functions for your specific use cases
