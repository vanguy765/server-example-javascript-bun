// filepath: c:\Users\3900X\Code\vapiordie3\vapiordie3\docs\examples\repository-pattern.md

# Supabase Data Access Approaches

This project provides two approaches to access Supabase data:

1. **Repository Pattern with Zod Validation** - A more structured approach with type safety and validation
2. **Direct API Usage** - A simpler approach with direct access to Supabase client responses

## Repository Pattern with Zod Validation

This is the primary approach used in the project, which adds type safety, validation, and consistent error handling:

## Structure

```
src/
  supabase/
    client.ts        # Supabase client initialization
    index.ts         # Barrel file that re-exports everything
    types.ts         # TypeScript interfaces for database tables
    schemas.ts       # Zod validation schemas
    tenants.ts       # Repository functions and routes for tenants
    products.ts      # Repository functions and routes for products (example)
```

## How to add a new entity

To add a new entity (database table), follow these steps:

1. **Add TypeScript interfaces in `types.ts`**

```typescript
// Add your new entity interface
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  tenant_id: string;
  created_at?: string;
}
```

2. **Create Zod schemas in `schemas.ts`**

```typescript
// Add validation schema for your entity
export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  tenant_id: z.string().uuid("Tenant ID must be a valid UUID"),
  created_at: z.string().optional(),
});

// Schema for creating a new product (omit auto-generated fields)
export const createProductSchema = productSchema.omit({
  id: true,
  created_at: true,
});

// Schema for updating an existing product (all fields optional)
export const updateProductSchema = createProductSchema.partial();

// Generate TypeScript types from schemas
export type ProductFromSchema = z.infer<typeof productSchema>;
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
```

3. **Create repository file with CRUD operations (`products.ts`)**

```typescript
import { supabaseClient } from "./client";
import { Hono } from "hono";
import { Bindings } from "../types/hono.types";
import { zValidator } from "@hono/zod-validator";
import type { Product } from "./types";
import {
  productSchema,
  createProductSchema,
  updateProductSchema,
  type CreateProductDTO,
  type UpdateProductDTO,
} from "./schemas";

const app = new Hono<{ Bindings: Bindings }>();

/**
 * Repository functions for products
 */

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabaseClient.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data as Product[];
}

// Get products by tenant ID
export async function getProductsByTenant(
  tenantId: string
): Promise<Product[]> {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error fetching products by tenant:", error);
    throw error;
  }

  return data as Product[];
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // Not found
    }
    console.error("Error fetching product by ID:", error);
    throw error;
  }

  return data as Product;
}

// Create a new product with validation
export async function createProduct(
  product: CreateProductDTO
): Promise<Product> {
  // Validate with Zod (will throw if invalid)
  createProductSchema.parse(product);

  const { data, error } = await supabaseClient
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data as Product;
}

// Update an existing product with validation
export async function updateProduct(
  id: string,
  product: UpdateProductDTO
): Promise<Product> {
  // Validate with Zod (will throw if invalid)
  updateProductSchema.parse(product);

  const { data, error } = await supabaseClient
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return data as Product;
}

// Delete a product by ID
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabaseClient.from("products").delete().eq("id", id);

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

/**
 * API routes for products
 */

// Get all products
app.get("/", async (c) => {
  try {
    const products = await getAllProducts();
    return c.json({ products }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get products by tenant
app.get("/tenant/:tenantId", async (c) => {
  try {
    const tenantId = c.req.param("tenantId");
    const products = await getProductsByTenant(tenantId);
    return c.json({ products }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Get product by ID
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const product = await getProductById(id);

    if (!product) {
      return c.json({ error: "Product not found" }, 404);
    }

    return c.json({ product }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Create product with validation
app.post("/", zValidator("json", createProductSchema), async (c) => {
  try {
    const body = await c.req.json();
    const product = await createProduct(body);
    return c.json({ product }, 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
});

// Update product with validation
app.patch("/:id", zValidator("json", updateProductSchema), async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const product = await updateProduct(id, body);
    return c.json({ product }, 200);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return c.json({ error: error.errors }, 400);
    }
    return c.json({ error: error.message }, 500);
  }
});

// Delete product
app.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await deleteProduct(id);
    return c.json({ message: "Product deleted successfully" }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export { app as productsRoute };
```

4. **Update `index.ts` to export your new repository**

```typescript
// Add these exports to index.ts
export {
  getAllProducts,
  getProductsByTenant,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  productsRoute,
} from "./products";

// Also export types and schemas
export type { Product } from "./types";
export {
  productSchema,
  createProductSchema,
  updateProductSchema,
} from "./schemas";
export type {
  ProductFromSchema,
  CreateProductDTO,
  UpdateProductDTO,
} from "./schemas";
```

5. **Update main application to use the routes**

```typescript
// In your main index.ts file
import { productsRoute } from "./supabase";

// Add the route
app.route("/api/supabase/products", productsRoute);
```

## Benefits of this pattern

1. **Type Safety**: TypeScript interfaces ensure consistent typing
2. **Validation**: Zod schemas validate data before DB operations
3. **Separation of Concerns**: Repository pattern isolates data access logic
4. **Consistency**: Standard pattern for all database entities
5. **Reusability**: Functions can be reused across different parts of the app
6. **Maintainability**: Easy to add new tables or modify existing ones

## Direct API Usage

For simpler use cases or more direct access to Supabase, you can use the direct API approach:

```typescript
import { tenantsDirectApi, supabaseClient } from "../supabase";

// Using the direct API (returns { data, error })
async function example() {
  const { data, error } = await tenantsDirectApi.getAllTenants();

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  console.log("Tenants:", data);
  return data;
}

// Using the raw Supabase client
async function advancedQuery() {
  const { data, error } = await supabaseClient
    .from("tenants")
    .select("id, name")
    .eq("status", "active");

  if (error) throw error;
  return data;
}
```

### Benefits of Direct API Approach

1. **Simplicity**: Less code and abstraction layers
2. **Full Access**: Direct access to all Supabase client features
3. **Raw Responses**: Access to both `data` and `error` properties
4. **Flexibility**: More control over queries and responses

### When to Choose Each Approach

| Feature         | Repository Pattern   | Direct API           |
| --------------- | -------------------- | -------------------- |
| Type Safety     | ★★★ (Strong)         | ★★ (Basic)           |
| Validation      | ★★★ (Built-in)       | ★ (Manual)           |
| Error Handling  | ★★★ (Consistent)     | ★★ (Manual)          |
| Code Amount     | ★★ (More code)       | ★★★ (Less code)      |
| Learning Curve  | ★★ (Steeper)         | ★★★ (Simpler)        |
| Maintainability | ★★★ (Better)         | ★★ (More repetition) |
| Flexibility     | ★★ (More structured) | ★★★ (More flexible)  |

Choose the Repository Pattern for larger projects that need consistency and safeguards. Choose the Direct API approach for simpler projects or when you need maximum flexibility.
