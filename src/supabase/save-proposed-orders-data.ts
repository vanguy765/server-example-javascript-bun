// filepath: c:\Users\3900X\Code\vapiordie3\vapiordie3\src\supabase\save-proposed-orders-data.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./generated.types";
import { createProposedOrdersDataRepository } from "./generated-repo";
import { ProposedOrdersDataSchema } from "./generated.schemas";
import { z } from "zod";

// Type for the JSON data that will be stored in the data column
type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

/**
 * Save data to the proposed_orders_data table with appropriate data_type
 *
 * @param client Supabase client
 * @param callId The ID of the current call
 * @param customerId The customer ID
 * @param tenantId The tenant ID
 * @param data The data to save (any type that can be converted to JSON)
 * @param dataType The type of data being saved ('special', 'favorites', 'order')
 * @returns The created record or null if there was an error
 */
export async function saveProposedOrdersData<T>(
  client: SupabaseClient<Database>,
  callId: string | number,
  customerId: string | number,
  tenantId: string | number,
  data: T,
  dataType: "special" | "favorites" | "order"
) {
  try {
    const repository = createProposedOrdersDataRepository(client);

    const newRecord = {
      call_id: callId,
      customer_id: customerId,
      tenant_id: tenantId,
      data: data as Json,
      data_type: dataType,
    };

    // Validate with the schema
    const validatedData = ProposedOrdersDataSchema.parse(newRecord);

    // Save to database
    const result = await repository.create(validatedData);
    return result;
  } catch (error) {
    console.error(
      `Error saving ${dataType} data to proposed_orders_data:`,
      error
    );
    throw error;
  }
}

/**
 * Save product specials data to the proposed_orders_data table
 */
export async function saveProductSpecials(
  client: SupabaseClient<Database>,
  callId: string | number,
  customerId: string | number,
  tenantId: string | number,
  productSpecialsResult: any
) {
  return saveProposedOrdersData(
    client,
    callId,
    customerId,
    tenantId,
    productSpecialsResult,
    "special"
  );
}

/**
 * Save customer preferences data to the proposed_orders_data table
 */
export async function saveCustomerPreferences(
  client: SupabaseClient<Database>,
  callId: string | number,
  customerId: string | number,
  tenantId: string | number,
  customerPreferencesResult: any
) {
  return saveProposedOrdersData(
    client,
    callId,
    customerId,
    tenantId,
    customerPreferencesResult,
    "favorites"
  );
}

/**
 * Save customer's last order data to the proposed_orders_data table
 */
export async function saveCustomerLastOrder(
  client: SupabaseClient<Database>,
  callId: string | number,
  customerId: string | number,
  tenantId: string | number,
  fetchCustomerLastOrder: any
) {
  return saveProposedOrdersData(
    client,
    callId,
    customerId,
    tenantId,
    fetchCustomerLastOrder,
    "order"
  );
}
