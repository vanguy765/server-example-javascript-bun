# Supabase Repository Pattern Documentation

This document provides an overview of the Repository Pattern implementation for Supabase in the project.

## Overview

The Repository Pattern is a design pattern that abstracts the data access layer from the rest of the application. This implementation creates a type-safe way to interact with your Supabase PostgreSQL database.

## Generated Files

The following files have been auto-generated:

1. `generated.types.ts` - TypeScript types for the database schema
2. `generated.enums.ts` - TypeScript enums for all database enum types
3. `generated.schemas.ts` - Zod validation schemas for all tables
4. `generated-repo.ts` - Repository pattern implementation for database operations

## Using the Repository Pattern

### Importing repositories

```typescript
import { repositories } from "../src/supabase/generated-repo";
```

This gives you access to all the pre-generated repositories for your database tables.

### Available repositories

For each table in your database, a repository is automatically created:

- `repositories.accessPhones`
- `repositories.agents`
- `repositories.apiKeys`
- `repositories.auditLogs`
- `repositories.callLogs`
- `repositories.customerInteractions`
- `repositories.customerPreferences`
- `repositories.customers`
- `repositories.industries`
- etc.

### Basic Operations

Each repository provides the following methods:

#### Get All Records

```typescript
const allCustomers = await repositories.customers.getAll();
```

#### Get By ID

```typescript
const customer = await repositories.customers.getById("some-uuid");
```

#### Create

```typescript
const newCustomer = await repositories.customers.create({
  tenant_id: "tenant-uuid",
  name: "John Doe",
  email: "john@example.com",
  // other fields...
});
```

#### Create Multiple Records

```typescript
const newProducts = await repositories.products.createMany([
  { name: "Product A", price: 10.99 /* other fields */ },
  { name: "Product B", price: 20.99 /* other fields */ },
]);
```

#### Update

```typescript
const updatedCustomer = await repositories.customers.update("customer-uuid", {
  name: "Jane Doe",
  email: "jane@example.com",
});
```

#### Update Multiple Records

```typescript
await repositories.products.updateMany("category_id", "category-uuid", {
  is_featured: true,
});
```

#### Delete

```typescript
await repositories.customers.delete("customer-uuid");
```

#### Delete Multiple

```typescript
await repositories.products.deleteMany("is_active", false);
```

### Filtering

#### Get By Column

```typescript
const activeCustomers = await repositories.customers.getBy("is_active", true);
```

#### Advanced Queries

```typescript
const { data } = await repositories.products
  .query()
  .eq("is_active", true)
  .gt("price", 20.0)
  .order("price", { ascending: false });
```

### Pagination

```typescript
const paginatedProducts = await repositories.products.getPaginated(2, 10);
console.log(`Page: ${paginatedProducts.pagination.page}`);
console.log(`Total pages: ${paginatedProducts.pagination.totalPages}`);
console.log(`Results: ${paginatedProducts.data.length}`);
```

### Other Utilities

#### Count Records

```typescript
const totalCustomers = await repositories.customers.count();
```

#### Check If Record Exists

```typescript
const exists = await repositories.customers.exists("customer-uuid");
```

#### Upsert Record

```typescript
const upsertedCustomer = await repositories.customers.upsert({
  id: "maybe-exists-uuid",
  name: "Customer Name",
  // other fields...
});
```

## Working with Enum Types

The generated enums can be imported from `generated.enums.ts`:

```typescript
import {
  ContactMethod,
  InteractionStatus,
} from "../src/supabase/generated.enums";

// Use in repository calls
const interaction = await repositories.customerInteractions.create({
  customer_id: "customer-uuid",
  purpose: InteractionPurpose.SALES,
  status: InteractionStatus.COMPLETED,
  contact_method: ContactMethod.EMAIL,
});
```

## Zod Schema Validation

The generated Zod schemas can be used to validate data before inserting or updating:

```typescript
import { customerSchema } from "../src/supabase/generated.schemas";

// Validate data before using repositories
const customerData = {
  name: "John Doe",
  email: "john@example.com",
  tenant_id: "tenant-uuid",
};

const validatedData = customerSchema.parse(customerData);
const newCustomer = await repositories.customers.create(validatedData);
```

## Example Usage

See the full example in `examples/using-repositories-example.ts` for a comprehensive demonstration of the repository pattern in action.

## Benefits of This Approach

1. **Type Safety**: Complete TypeScript types for all database operations
2. **Consistency**: Consistent API for all database tables
3. **Testability**: Easy to mock for testing
4. **Maintainability**: Centralized data access layer
5. **Developer Experience**: Autocompletion and type checking

## Regenerating Files

To regenerate these files after database schema changes:

```bash
pnpm gen:types
pnpm gen:schema-types
```

update
Now you can generate types for your specific Supabase project in three ways:

```bash
pnpm gen:types:direct (fastest and most reliable)
pnpm gen:types:hfxxp (uses the fixed script)
pnpm gen:types (tries to auto-detect the project)
```
