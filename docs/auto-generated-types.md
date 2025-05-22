# Auto-Generated Supabase Types & Schemas

This system automatically generates TypeScript types and Zod validation schemas from your Supabase database.

## Getting Started

To generate the types and schemas, run:

```bash
pnpm run gen:types
```

This will create three files:

1. `src/supabase/generated.types.ts` - TypeScript interfaces and types
2. `src/supabase/generated.schemas.ts` - Zod validation schemas
3. `src/supabase/generated-repo.ts` - Repository pattern helpers

## Prerequisites

You need to have the following environment variables set:

- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_ACCESS_TOKEN` (optional) - For using the Supabase CLI approach

## How to Use the Generated Code

### Option 1: Use the pre-generated repositories

```typescript
import { repositories } from "../supabase/generated-repo";

// Use the pre-generated repositories
async function getUsers() {
  const users = await repositories.users.getAll();
  return users;
}

async function createUser(userData) {
  const user = await repositories.users.create(userData);
  return user;
}
```

### Option 2: Create a custom repository with type safety

```typescript
import { createRepository } from "../supabase/generated-repo";
import { Database } from "../supabase/generated.types";

// Create a repository for a specific table
const productsRepo = createRepository("products");

// Use with full type safety
async function getProductsByCategory(categoryId: string) {
  // This has full type checking:
  // - Return type is Product[]
  // - Parameters like categoryId are type-checked
  const products = await productsRepo.getAll();
  return products.filter((p) => p.category_id === categoryId);
}
```

### Option 3: Use directly with your current Repository Pattern

```typescript
import { Database } from "../supabase/generated.types";
import * as schemas from "../supabase/generated.schemas";

// Get types from the generated types file
type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
type CreateTenantDTO = Database["public"]["Tables"]["tenants"]["Insert"];
type UpdateTenantDTO = Database["public"]["Tables"]["tenants"]["Update"];

// Use the schemas for validation
export async function createTenant(tenant: CreateTenantDTO): Promise<Tenant> {
  // Validate with generated schema
  schemas.tenantsInsertSchema.parse(tenant);

  // Your existing code...
  const { data, error } = await supabaseClient
    .from("tenants")
    .insert(tenant)
    .select()
    .single();

  // ...
}
```

## Benefits of Using the Generated Types and Schemas

1. **Automatic Type Safety**: Types always reflect the actual database structure
2. **Consistent Validation**: Zod schemas are derived directly from the database schema
3. **DRY Code**: No need to manually define types and validation schemas
4. **Less Maintenance**: When your database changes, just regenerate the types
5. **IDE Support**: Full IDE autocomplete for database fields

## How to Customize

You can modify the `generate-types.ts` script to customize how types and schemas are generated.

## Notes About Edge Cases

- **Enum Types**: PostgreSQL enum types may need manual adjustment in the generated files
- **Complex Relationships**: Foreign key relationships might need additional type definitions
- **Custom Column Types**: PostgreSQL custom types might need manual type mapping
