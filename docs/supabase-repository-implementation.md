# Supabase Repository Pattern Implementation

This document summarizes the complete implementation of the Repository Pattern for a Supabase PostgreSQL database.

## Overview

The Repository Pattern provides a clean abstraction layer between your application logic and the data access layer. We've generated complete TypeScript type definitions, Zod validation schemas, and repository functions for all tables in the database.

## Generated Files

1. **`generated.types.ts`** - Contains full TypeScript type definitions for the database schema
2. **`generated.enums.ts`** - Contains TypeScript enum definitions that match PostgreSQL enum types
3. **`generated.schemas.ts`** - Contains Zod validation schemas for all tables
4. **`generated-repo.ts`** - Contains the repository pattern implementation

## Type Safety

The implementation provides complete type safety for:

- Table row types
- Insert operations
- Update operations
- Query operations
- Enum values

## Features

### Repository Functions

Each table repository includes these functions:

#### Basic CRUD Operations

- `getAll()` - Get all records
- `getById(id)` - Get a record by ID
- `create(record)` - Create a new record
- `update(id, record)` - Update an existing record
- `delete(id)` - Delete a record

#### Bulk Operations

- `createMany(records)` - Create multiple records at once
- `updateMany(column, value, record)` - Update multiple records matching a condition
- `deleteMany(column, value)` - Delete multiple records matching a condition

#### Query Operations

- `getBy(column, value)` - Get records filtered by a column value
- `query()` - Get a filter builder for complex queries
- `count()` - Count total records
- `exists(id)` - Check if a record exists by ID

#### Advanced Operations

- `upsert(record)` - Insert if not exists, update if exists
- `getPaginated(page, pageSize)` - Get paginated results

## Example Usage

See `examples/using-repositories-example.ts` for detailed examples of using the repositories, including:

1. Basic CRUD operations with tenants
2. Working with customers and customer preferences
3. Using enums with interactions
4. Advanced queries with filtering and pagination

## Testing

See `examples/repository-test-example.ts` for examples of unit testing repository functions using mocks.

## Benefits

This implementation provides several benefits:

1. **Type Safety** - Full TypeScript type safety for all database operations
2. **Validation** - Built-in validation using Zod schemas
3. **Consistency** - Uniform API for interacting with all database tables
4. **Maintainability** - Centralized data access logic
5. **Testability** - Easy to mock for unit tests
6. **Developer Experience** - Intellisense and autocomplete for all operations

## Regenerating

To regenerate these files after database schema changes:

```bash
pnpm gen:types        # Generate TypeScript types from Supabase schema
pnpm gen:schema-types # Generate Zod schemas from database schema
```

## Extending

To add custom repository functions for specific tables, you can extend the base repositories:

```typescript
import { repositories } from "./src/supabase/generated-repo";

// Extend the customers repository with custom methods
export const customersRepo = {
  ...repositories.customers,

  // Add custom methods
  getActiveCustomers: async () => {
    return await repositories.customers.getBy("is_active", true);
  },

  getCustomerWithPreferences: async (id: string) => {
    const customer = await repositories.customers.getById(id);
    if (!customer) return null;

    const preferences = await repositories.customerPreferences.getBy(
      "customer_id",
      id
    );
    return { ...customer, preferences: preferences[0] || null };
  },
};
```
