/**
 * Example of unit testing the repository pattern
 * This shows how you can mock the Supabase client for testing
 */

import { vi, describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { createRepository } from "../src/supabase/generated-repo";
import type { Database } from "../src/supabase/generated.types";

// Mock the Supabase client
vi.mock("@supabase/supabase-js", () => {
  const mockFrom = vi.fn();
  const mockSelect = vi.fn();
  const mockEq = vi.fn();
  const mockSingle = vi.fn();
  const mockInsert = vi.fn();
  const mockUpdate = vi.fn();
  const mockDelete = vi.fn();

  return {
    createClient: vi.fn(() => ({
      from: mockFrom.mockReturnValue({
        select: mockSelect.mockReturnValue({
          eq: mockEq.mockReturnValue({
            single: mockSingle.mockReturnValue({ data: null, error: null }),
          }),
          single: mockSingle.mockReturnValue({ data: null, error: null }),
        }),
        insert: mockInsert.mockReturnValue({
          select: mockSelect.mockReturnValue({
            single: mockSingle.mockReturnValue({ data: null, error: null }),
          }),
        }),
        update: mockUpdate.mockReturnValue({
          eq: mockEq.mockReturnValue({
            select: mockSelect.mockReturnValue({
              single: mockSingle.mockReturnValue({ data: null, error: null }),
            }),
          }),
        }),
        delete: mockDelete.mockReturnValue({
          eq: mockEq.mockReturnValue({ error: null }),
        }),
      }),
    })),
  };
});

// Sample test data
const mockTenant = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Test Tenant",
  is_active: true,
  created_at: new Date().toISOString(),
};

// Get the mocked client
const mockClient = createClient("https://fake.supabase.co", "fake-key");

// Create a repository with the mocked client
const tenantsRepo = createRepository<
  "tenants",
  Database["public"]["Tables"]["tenants"]["Row"],
  Database["public"]["Tables"]["tenants"]["Insert"],
  Database["public"]["Tables"]["tenants"]["Update"]
>("tenants");

describe("Tenants Repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should get a tenant by ID", async () => {
    // Setup the mock response
    const mockResponse = { data: mockTenant, error: null };
    mockClient.from().select().eq().single.mockResolvedValue(mockResponse);

    // Call the repository method
    const result = await tenantsRepo.getById(mockTenant.id);

    // Assertions
    expect(mockClient.from).toHaveBeenCalledWith("tenants");
    expect(mockClient.from().select).toHaveBeenCalledWith("*");
    expect(mockClient.from().select().eq).toHaveBeenCalledWith(
      "id",
      mockTenant.id
    );
    expect(result).toEqual(mockTenant);
  });

  it("should create a tenant", async () => {
    // Setup mock data
    const newTenant = { name: "New Tenant", is_active: true };
    const mockResponse = { data: { ...newTenant, id: "new-id" }, error: null };
    mockClient.from().insert().select().single.mockResolvedValue(mockResponse);

    // Call the repository method
    const result = await tenantsRepo.create(newTenant);

    // Assertions
    expect(mockClient.from).toHaveBeenCalledWith("tenants");
    expect(mockClient.from().insert).toHaveBeenCalledWith(newTenant);
    expect(mockClient.from().insert().select).toHaveBeenCalled();
    expect(result).toEqual(mockResponse.data);
  });

  it("should update a tenant", async () => {
    // Setup mock data
    const updateData = { name: "Updated Name" };
    const mockResponse = {
      data: { ...mockTenant, ...updateData },
      error: null,
    };
    mockClient
      .from()
      .update()
      .eq()
      .select()
      .single.mockResolvedValue(mockResponse);

    // Call repository method
    const result = await tenantsRepo.update(mockTenant.id, updateData);

    // Assertions
    expect(mockClient.from).toHaveBeenCalledWith("tenants");
    expect(mockClient.from().update).toHaveBeenCalledWith(updateData);
    expect(mockClient.from().update().eq).toHaveBeenCalledWith(
      "id",
      mockTenant.id
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("should delete a tenant", async () => {
    // Setup mock response
    const mockResponse = { error: null };
    mockClient.from().delete().eq.mockResolvedValue(mockResponse);

    // Call repository method
    await tenantsRepo.delete(mockTenant.id);

    // Assertions
    expect(mockClient.from).toHaveBeenCalledWith("tenants");
    expect(mockClient.from().delete).toHaveBeenCalled();
    expect(mockClient.from().delete().eq).toHaveBeenCalledWith(
      "id",
      mockTenant.id
    );
  });

  it("should handle errors gracefully", async () => {
    // Setup mock error
    const mockError = { code: "ERROR", message: "Database error" };
    mockClient
      .from()
      .select()
      .eq()
      .single.mockResolvedValue({ data: null, error: mockError });

    // Call repository and expect error
    await expect(tenantsRepo.getById(mockTenant.id)).rejects.toEqual(mockError);
  });
});
