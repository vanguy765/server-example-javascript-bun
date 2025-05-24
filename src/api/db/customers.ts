import { createRepository } from "../../supabase/generated-repo";
import { CustomerRow, CustomerInsertInput } from "./types";
import {
  customersRowSchema,
  customersInsertSchema,
} from "../../supabase/generated.schemas";

/**
 * Retrieves a customer by their user ID from the database
 * @param userId - The ID of the user to find the customer for
 * @returns Promise resolving to the customer record or null if not found
 */
export async function getCustomerByUserIdFromDb(
  userId: string
): Promise<CustomerRow | null> {
  const repo = createRepository("customers");
  try {
    const all = await repo.getAll();
    const data = all.find(
      (c) => (c as Partial<CustomerRow>).user_id === userId
    );
    if (data) return customersRowSchema.parse(data);
    return null;
  } catch (e: any) {
    console.error(`getCustomerByUserIdFromDb Error: ${e.message}`);
    return null;
  }
}

/**
 * Creates a new customer record in the database
 * @param userId - The ID of the user to create a customer for
 * @param tenantId - The tenant ID to associate with the customer
 * @param firstName - (Optional) The first name of the customer
 * @param lastName - (Optional) The last name of the customer
 * @returns Promise resolving to the created customer record or null if creation fails
 */
export async function createCustomerInDb(
  userId: string,
  tenantId: string,
  firstName?: string,
  lastName?: string
): Promise<CustomerRow | null> {
  const repo = createRepository("customers");
  try {
    const customerData: CustomerInsertInput = {
      user_id: userId,
      tenant_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      first_name: firstName ?? "DefaultFirst",
      last_name: lastName ?? "DefaultLast",
      email: `${userId.substring(0, 8)}@customerexample.com`,
    };
    const validated = customersInsertSchema.parse(customerData);
    const newData = await repo.create(validated);
    if (!newData) throw new Error("Repo create returned null");
    return customersRowSchema.parse(newData);
  } catch (e: any) {
    console.error(`createCustomerInDb Error: ${e.message}`);
    return null;
  }
}
