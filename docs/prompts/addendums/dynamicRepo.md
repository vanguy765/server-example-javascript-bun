**Addendum Prompt for AI: Interacting with the Supabase Project (Revised)**

You are tasked with working on a project that uses Supabase for its backend. Data access and validation follow a specific pattern involving several key generated files. Please adhere to these guidelines:

**1. Core Generated Files and Their Purpose:**

- **[`vapiordie3/src/supabase/generated-repo.ts`](vapiordie3/src/supabase/generated-repo.ts): The Data Access Layer.**

  - Exports: [`createRepository<T extends keyof Database['public']['Tables']>(tableName: T)`](vapiordie3/src/supabase/generated-repo.ts:10).
  - **Usage:** Call `createRepository('your_table_name')` to get a dynamic "repository" object with CRUD methods (`getAll()`, `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)`) for that specific table.

- **[`vapiordie3/src/supabase/generated.schemas.ts`](vapiordie3/src/supabase/generated.schemas.ts): The Data Validation and Structure Layer.**

  - Contains Zod schemas for each table (e.g., `someTableNameInsertSchema`, `someTableNameUpdateSchema`, `someTableNameRowSchema`) and for database enums (e.g., `yourEnumNameSchema` as `z.union([z.literal('valueA'), ...])`).
  - **Use these schemas to validate data before database operations and to define data structures.**

- **[`vapiordie3/src/supabase/generated.enums.ts`](vapiordie3/src/supabase/generated.enums.ts): Enum Definitions and Utilities.**

  - Intended for TypeScript `enum` definitions mirroring database enums.
  - Includes helper: [`getEnumValues()`](vapiordie3/src/supabase/generated.enums.ts:12).
  - **Note:** For data _validation_ of enum fields, prioritize Zod enum schemas from `generated.schemas.ts`.

- **`vapiordie3/src/supabase/generated.types.ts` (Crucial Prerequisite - Assumed):**

  - Exports the main `Database` TypeScript interface (from Supabase CLI generation). This is vital for `createRepository`'s type safety.

- **`vapiordie3/src/supabase/client.ts` (Crucial Prerequisite - Assumed):**
  - Exports your initialized Supabase client instance (e.g., `supabaseClient`). Repositories use this internally.

**2. Standard Workflow for Modifying Data (e.g., Create or Update):**

1.  **Import:**

    - [`createRepository`](vapiordie3/src/supabase/generated-repo.ts:10) from [`generated-repo.ts`](vapiordie3/src/supabase/generated-repo.ts).
    - Relevant Zod schema(s) from [`generated.schemas.ts`](vapiordie3/src/supabase/generated.schemas.ts).
    - `z` from `zod` (for `z.input`, `z.output`, `ZodError`).

2.  **Define TypeScript Input/Output Types (Highly Recommended):**

    - Derive TypeScript types from your Zod schemas for better static type checking of function parameters and return values:

      ```typescript
      import { z } from "zod";
      // Example: const itemsInsertSchema = z.object({ name: z.string(), ... });
      type ItemInsertInput = z.input<typeof itemsInsertSchema>;

      // For function return types, you might use z.output with a RowSchema:
      // type ItemRowOutput = z.output<typeof itemsRowSchema>;
      ```

    - Use these derived types in your function signatures:
      `async function createNewItem(data: ItemInsertInput): Promise<ItemRowOutput | null> { ... }`

3.  **Get Repository:**

    - `const myRepo = createRepository('actual_table_name');`

4.  **Prepare Data:**

    - Construct a JavaScript object conforming to your derived TypeScript input type (e.g., `ItemInsertInput`).

5.  **Validate Data (CRITICAL RUNTIME STEP):**

    - Use the `.parse()` method of the Zod schema:
      `const validatedData = itemsInsertSchema.parse(yourInputDataObject);`
    - Handle potential `ZodError` if validation fails.

6.  **Execute Database Operation:**
    - Use repository methods with `validatedData`:
      `const newRecord = await myRepo.create(validatedData);`

**3. Working with Enum Fields:**

- **Assigning & Validating:** Assign one of the exact string literal values defined in the Zod enum schema (from `generated.schemas.ts`). The Zod `.parse()` step will validate it.
- **Getting All Possible Enum Values:** Use the `.options` array of the Zod union schema:
  `const allowedValues = yourEnumZodSchema.options.map(opt => opt.value);`

**4. Quick Example (Creating a record with derived types):**

```typescript
import { createRepository } from "./generated-repo";
// Adjust schema names to your actual generated schemas
import {
  productsInsertSchema,
  productStatusSchema,
  productsRowSchema,
} from "./generated.schemas.ts";
import { z } from "zod";

// 1. Derive TypeScript types from Zod schemas
type ProductCreateInput = z.input<typeof productsInsertSchema>;
type ProductRow = z.output<typeof productsRowSchema>; // For the return type

async function createProduct(
  productData: ProductCreateInput
): Promise<ProductRow | null> {
  const productsRepo = createRepository("products"); // Use your actual table name

  try {
    // 2. Validate data at runtime (even if productData already matches ProductCreateInput)
    const validatedProductData = productsInsertSchema.parse(productData);

    // 3. Create record
    const newProduct = (await productsRepo.create(
      validatedProductData
    )) as ProductRow; // Cast if confident
    console.log("Product created:", newProduct);
    return newProduct;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error.flatten().fieldErrors);
    } else {
      console.error("Error creating product:", error);
    }
    return null; // Or throw error
  }
}

// Example usage:
// const newProductDetails: ProductCreateInput = {
//   name: "Awesome Gadget",
//   price: 99.99,
//   status: "active" // Assuming "active" is a valid value in productStatusSchema
//   // ... other required fields
// };
// createProduct(newProductDetails);
```

**Key Principles:**

- **Derive Types:** Use `z.input<...>` and `z.output<...>` for strong TypeScript types alongside Zod.
- **Validate Before Write:** Always use Zod's `.parse()` for runtime validation before database writes.
- **Type Safety:** Leverage TypeScript for compile-time checks.
- **Consistency:** Use the repository pattern.
