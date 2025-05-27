import { createRepository } from "../supabase/generated-repo";
import { tenantsRowSchema } from "../supabase/generated.schemas"; // Ensure this schema exists and is correctly named
import { z, ZodError } from "zod";

// 1. Define TypeScript type for the tenant row (assuming 'tenants' table)
type Tenant = z.output<typeof tenantsRowSchema>;

/**
 * Fetches a tenant by their domain name.
 * @param domainToFind The domain name to search for.
 * @returns The tenant object if found, otherwise null.
 */
async function getTenantByDomain(domainToFind: string): Promise<Tenant | null> {
  // 2. Get the repository for the 'tenants' table.
  // Replace 'tenants' with your actual table name if different.
  const tenantsRepo = createRepository("tenants");

  try {
    // Get orders with nested relationships (order_items and their products)
    const ordersWithItemsAndProducts = await buildDynamicQuery("orders", {
      columns: ["id", "order_date", "status"],
      relationships: [
        {
          table: "order_items",
          columns: [
            "id",
            "quantity",
            "price",
            "product:product_id(id, name, description, size)", // Use foreign key reference
          ],
          jsonKey: "lineItems",
        },
        {
          table: "customers",
          columns: ["id", "first_name", "last_name", "phone"],
          jsonKey: "customer",
        },
        {
          table: "tenants",
          columns: ["id", "name", "domain"],
          jsonKey: "company",
        },
      ],
      jsonKey: "proposed_order",
    });

    console.log(`Orders with items and products:`, ordersWithItemsAndProducts);

    // 3. Fetch all tenants.
    // Note: For very large tables, fetching all records and then filtering client-side
    // can be inefficient. If the underlying Supabase client used by the repository
    // allows server-side filtering (e.g., .eq('domain', domainToFind)), that would be
    // more performant. The provided docs for `createRepository` focus on generic CRUD.
    const allTenants = await tenantsRepo.getAll();

    // 4. Filter tenants to find the one with the matching domain.
    // This assumes that items in `allTenants` have a 'domain' property.
    // You might need to cast `item` if its type isn't specific enough.
    const foundTenantData = allTenants.find((item) => {
      // Accessing 'domain' safely, assuming it might not be strictly typed on `item`
      // or `item` could be of a more generic type from `getAll()`.
      const itemAsPotentialTenant = item as Partial<Tenant>;
      return itemAsPotentialTenant.domain === domainToFind;
    });

    if (foundTenantData) {
      // 5. Validate the found data against the schema to ensure it's a valid Tenant.
      // This step is crucial as per the documentation's emphasis on validation.
      const validatedTenant = tenantsRowSchema.parse(foundTenantData);
      console.log(
        `Tenant with domain "${domainToFind}" found:`,
        validatedTenant
      );
      return validatedTenant;
    } else {
      console.log(`Tenant with domain "${domainToFind}" not found.`);
      return null;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      console.error(
        `Validation error for tenant data with domain "${domainToFind}":`,
        error.flatten().fieldErrors
      );
    } else {
      console.error(
        `Error fetching tenant with domain "${domainToFind}":`,
        error
      );
    }
    return null; // Or re-throw, depending on error handling strategy
  }
}

// Example usage:
async function main() {
  const domain = "acmecleaning.com";
  const phone = "+17787754146"; // Example phone number
  const tenantId = "f0555d1a-5da7-4d15-b864-a1c6b16458a8";
  const tenant = await getTenantByDomain(domain);

  if (tenant) {
    // You can now use the tenant object
    const tenantId = tenant.id;
    console.log(`Tenant ID: ${tenantId}`);

    const userPhoneNumber = phone;
    console.log(`User phone number: ${userPhoneNumber}`);
  }
}

main();
