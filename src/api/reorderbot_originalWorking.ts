import { Hono } from "hono";
import { envConfig } from "../config/env.config";
import { Bindings } from "../types/hono.types";
import { z } from "zod";
// Assuming your generated schemas are here:
import { tenantsRowSchema } from "../supabase/generated.schemas";
// Import the factory function for creating repositories
import { createRepository } from "../supabase/generated-repo";
// It's highly recommended to import your main 'Database' type.
// This allows createRepository to be more strongly typed if it uses generics
// that depend on the Database schema (e.g., for table name validation and row type inference).
// import type { Database } from "../supabase/generated.types";

// 1. Derive the TypeScript type for a single tenant row
type TenantRow = z.output<typeof tenantsRowSchema>;

const app = new Hono<{ Bindings: Bindings }>();

app.post("/", async (c) => {
  // For stronger type safety, consider defining a Zod schema for this request body
  // and parsing it, e.g.:
  // const requestBodySchema = z.object({ phoneNumberId: z.string(), assistantId: z.string(), customerNumber: z.string() });
  // const parseResult = requestBodySchema.safeParse(await c.req.json());
  // if (!parseResult.success) { /* handle validation error */ }
  // const { phoneNumberId, assistantId, customerNumber } = parseResult.data;
  const { phoneNumberId, assistantId, customerNumber } =
    await c.req.json<any>(); // Using <any> if not validating body yet

  console.log(
    `reorderbot_originalWorking: Received request to place outbound call with 
    phoneNumberId: ${phoneNumberId}, 
    assistantId: ${assistantId}, 
    customerNumber: ${customerNumber}`
  );

  // =============================================================================
  // VALIDATE USER, GET DB DATA: TENANT, CUSTOMER, PROPOSED ORDER
  // =============================================================================

  // 2. Declare the 'tenants' variable with the derived TypeScript type
  let tenants: TenantRow[] | undefined;

  try {
    // 3. Create a repository instance for the 'tenants' table.
    //    Ensure 'tenants' is the exact name of your table in the database schema.
    const tenantsRepository = createRepository("tenants");

    // 4. Call the getAll() method on the repository instance.
    //    Ideally, `createRepository('tenants').getAll()` is typed to return `Promise<TenantRow[]>`.
    const fetchedTenantsFromRepo = await tenantsRepository.getAll();

    // 5. Assign to 'tenants'.
    //    If `fetchedTenantsFromRepo` is known to be `TenantRow[]` or `Database['public']['Tables']['tenants']['Row'][]`
    //    (and these types are compatible), direct assignment is fine.
    //    If `fetchedTenantsFromRepo` could be `null` (e.g., if `getAll` doesn't throw on error but returns null for data),
    //    handle that: `tenants = fetchedTenantsFromRepo === null ? undefined : fetchedTenantsFromRepo;`
    //    Assuming `getAll()` throws on error and returns `RowType[]` (possibly empty if no records):
    if (fetchedTenantsFromRepo) {
      // This assertion is a common way to bridge types if TypeScript can't automatically
      // verify that the structure from `getAll()` perfectly matches `TenantRow[]`,
      // but you, as the developer, know they are compatible.
      // The best solution is for `createRepository().getAll()` to be explicitly typed
      // to return `Promise<TenantRow[]>` or a directly assignable type.
      tenants = fetchedTenantsFromRepo as TenantRow[];
    } else {
      // If fetchedTenantsFromRepo can be null or undefined from a successful call (e.g. no error but no data)
      tenants = []; // Default to an empty array if no tenants were fetched but no error occurred
    }

    console.log(
      "Successfully retrieved tenants using dynamic repository:",
      tenants
    );
    console.log();

    if (tenants && tenants.length > 0 && tenants[0]) {
      // Example: Accessing a property with type safety. 'name' would be checked by TypeScript.
      // console.log("First tenant name:", tenants[0].name);
    }
  } catch (error) {
    console.error(
      "Failed to retrieve tenants using dynamic repository:",
      error
    );
    tenants = undefined; // Ensure tenants is undefined on error
  }

  // =============================================================================
  // BUILD THE PROMPT FOR THE ASSISTANT
  // =============================================================================

  // =============================================================================
  //VAPI CALL SECTION
  // =============================================================================
  // VAPI Call Section
  try {
    const response = await fetch(`${envConfig.vapi.baseUrl}/call/phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envConfig.vapi.apiKey}`,
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        assistantId: assistantId,
        customer: {
          number: customerNumber,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response
        .text()
        .catch(() => "Could not read error body");
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`
      );
    }

    const data = await response.json();
    return c.json(data, 200);
  } catch (error) {
    // Changed from 'error: any' to 'error' (implicitly unknown)
    console.error("VAPI call failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during VAPI call";
    return c.json(
      {
        message: "Failed to place outbound call",
        error: errorMessage,
      },
      500
    );
  }
});

export { app as reorderbotRoute };
