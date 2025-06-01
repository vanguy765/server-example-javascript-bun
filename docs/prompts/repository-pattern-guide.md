# Repository Pattern & Query Builder Guide

This document explains the repository pattern and query builder implementation used in the Vapiordie3 application. These utilities provide a standardized and safe way to interact with the database.

## Repository Pattern

### Overview

The repository pattern is a design pattern that abstracts the data access layer from the rest of the application. In this codebase, it provides type-safe operations for Supabase tables.

Key features:

- Encapsulates database operations (CRUD)
- Provides consistent error handling
- Enforces type safety with TypeScript
- Offers graceful fallbacks when database connections fail

### Implementation

The repository pattern is implemented in `src/supabase/generated-repo.ts` with these components:

#### Core Factory Function

```typescript
createRepository<T>(client, tableName)
```

This is the foundation that creates a repository for any table with standardized methods:

- `getAll()` - Fetches all records from a table
- `getById(id)` - Fetches a single record by ID
- `create(record)` - Creates a new record
- `update(id, updates)` - Updates an existing record
- `delete(id)` - Deletes a record
- `query()` - Returns a query builder for custom operations

#### Repository Instances

For each table, a specialized creator function is generated:

```typescript
createProductsRepository(client)
createCustomersRepository(client)
// etc.
```

### Safe Repository Access

To safely access repositories throughout the application:

```typescript
import { getSafeRepository } from "./api/db-utils";

// Get a repository with automatic error handling
const productsRepo = await getSafeRepository("products");

// Use standard repository methods
const allProducts = await productsRepo.getAll();
const product = await productsRepo.getById("123");
```

The `getSafeRepository` function provides:

- Client validation & automatic recovery
- Graceful fallbacks to mock repositories when necessary
- Consistent logging for debugging issues

## Query Builder

### Overview

The query builder (`src/api/utils/queryBuilder.ts`) extends the repository pattern with advanced query capabilities that are not covered by the standard repository methods.

Key features:

- Dynamic column selection
- Complex filtering with different operators
- Managing relationships/joins
- Custom JSON structure for responses
- Sorting and pagination
- Single record or array responses

### Usage Examples

#### Basic Query

```typescript
import { buildDynamicQuery } from "../api/utils/queryBuilder";

// Get all products with specific columns
const { data, error } = await buildDynamicQuery("products", {
  columns: ["id", "name", "price", "created_at"]
});
```

#### Filtering

```typescript
// Get products with price > 100
const { data, error } = await buildDynamicQuery("products", {
  columns: ["id", "name", "price"],
  filters: [
    { column: "price", operator: "gt", value: 100 }
  ]
});
```

#### Relationships/Joins

```typescript
// Get orders with their products
const { data, error } = await buildDynamicQuery("orders", {
  columns: ["id", "order_number", "total"],
  relationships: [
    { table: "order_items", columns: ["product_id", "quantity", "price"] }
  ]
});
```

#### Sorting and Pagination

```typescript
// Get sorted and limited list
const { data, error } = await buildDynamicQuery("products", {
  sorting: [
    { column: "created_at", direction: "desc" }
  ],
  limit: 10
});
```

#### Single Record with Custom JSON Key

```typescript
// Get single product with custom naming
const { data, error } = await buildDynamicQuery("products", {
  columns: ["id", "name", "description"],
  filters: [{ column: "id", operator: "eq", value: productId }],
  jsonKey: "product",
  single: true
});
```

### Using with Repository Pattern

The repository pattern and query builder can be used together:

```typescript
// Get repository
const productsRepo = await getSafeRepository("products");

// For simple operations, use repository methods
const product = await productsRepo.getById("123");

// For complex queries, use the query() method with Supabase's API
const { data } = await productsRepo.query()
  .select("name, price")
  .eq("category", "electronics")
  .order("price", { ascending: true });
  
// Or use the buildDynamicQuery utility for more complex needs
const { data } = await buildDynamicQuery("products", {
  columns: ["id", "name", "price"],
  filters: [{ column: "category", operator: "eq", value: "electronics" }],
  sorting: [{ column: "price", direction: "asc" }]
});
```

## Best Practices

1. **Always use getSafeRepository** for accessing tables to ensure error handling
2. **Use repository methods for simple operations** (getById, create, etc.)
3. **Use buildDynamicQuery for complex reads** with relationships, filtering, etc.
4. **Handle errors consistently** by checking the error property in responses
5. **Type your data** using the Database types from `generated.types.ts`

## Error Handling

Both the repository pattern and query builder include robust error handling:

```typescript
// With repository
try {
  const product = await productsRepo.getById("123");
  // Use product
} catch (error) {
  console.error("Error getting product:", error);
}

// With query builder
const { data, error } = await buildDynamicQuery("products", {
  columns: ["id", "name"]
});

if (error) {
  console.error("Query error:", error);
} else {
  // Use data
}
```

This architecture ensures database operations are safe, consistent, and maintainable across the application.
