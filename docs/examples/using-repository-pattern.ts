/**
 * Example demonstrating how to use the Repository Pattern in your application
 */
import {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  type CreateTenantDTO,
  type UpdateTenantDTO,
} from "../../src/supabase";

// Example: Fetching all tenants
async function listAllTenants() {
  try {
    const tenants = await getAllTenants();
    console.log("All tenants:", tenants);
    return tenants;
  } catch (error) {
    console.error("Failed to fetch tenants:", error);
    throw error;
  }
}

// Example: Fetching a single tenant
async function getSingleTenant(id: string) {
  try {
    const tenant = await getTenantById(id);
    if (!tenant) {
      console.log(`Tenant with ID ${id} not found`);
      return null;
    }
    console.log("Found tenant:", tenant);
    return tenant;
  } catch (error) {
    console.error(`Failed to fetch tenant ${id}:`, error);
    throw error;
  }
}

// Example: Creating a new tenant
async function createNewTenant(data: CreateTenantDTO) {
  try {
    // The validation is handled by the repository function
    const tenant = await createTenant(data);
    console.log("Created tenant:", tenant);
    return tenant;
  } catch (error) {
    console.error("Failed to create tenant:", error);
    throw error;
  }
}

// Example: Updating a tenant
async function updateExistingTenant(id: string, data: UpdateTenantDTO) {
  try {
    // The validation is handled by the repository function
    const tenant = await updateTenant(id, data);
    console.log("Updated tenant:", tenant);
    return tenant;
  } catch (error) {
    console.error(`Failed to update tenant ${id}:`, error);
    throw error;
  }
}

// Example: Deleting a tenant
async function removeExistingTenant(id: string) {
  try {
    await deleteTenant(id);
    console.log(`Tenant ${id} deleted successfully`);
  } catch (error) {
    console.error(`Failed to delete tenant ${id}:`, error);
    throw error;
  }
}

// Example usage in an Express/Hono route handler
async function handleGetTenant(req: any, res: any) {
  try {
    const id = req.params.id;
    const tenant = await getTenantById(id);

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    return res.status(200).json({ tenant });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

// Example of handling validation errors
async function handleCreateTenant(req: any, res: any) {
  try {
    const data = req.body;
    const tenant = await createTenant(data);
    return res.status(201).json({ tenant });
  } catch (error: any) {
    // Check if it's a validation error
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors,
      });
    }
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Benefits of this approach:
 *
 * 1. Type safety throughout your application
 * 2. Validation is handled by the repository functions
 * 3. Clean separation between DB operations and business logic
 * 4. Consistent error handling
 * 5. Easy to test with mocks
 */
