/**
 * Reorderbot API - Refactored
 *
 * This module provides a Hono API endpoint for initiating outbound sales calls
 * using a voice AI assistant. It fetches customer data, order history, product
 * specials, and customer preferences to generate a personalized call experience.
 */

import { Hono } from "hono";
import { Bindings } from "../types/hono.types";
import { z } from "zod";
import { tenantsRowSchema } from "../supabase/generated.schemas";
import { createRepository } from "../supabase/generated-repo";
import * as path from "path";
import * as fs from "fs";

// Import utility modules
import { buildDynamicQuery } from "./utils/queryBuilder";
import {
  fetchCustomerLastOrder,
  calculateOrderTotals,
  formatOrderComponents,
} from "./utils/orderService";
import {
  fetchProductSpecials,
  calculateDiscountedPrices,
  formatProductSpecials,
  fetchCustomerPreferences,
  extractFavoriteProductIds,
  fetchFavoriteProducts,
  formatFavoriteProducts,
} from "./utils/productService";
import {
  AgentConfig,
  buildPromptFromFile,
  createAssistantConfig,
  tool_sendOrderPackageBySms,
} from "./utils/assistantConfig";
import { makeOutboundCall } from "./utils/vapiService";

// Define type for tenant rows from the database
type TenantRow = z.output<typeof tenantsRowSchema>;

// Create Hono app with bindings
const app = new Hono<{ Bindings: Bindings }>();

// For development, use a fixed customer ID
const CUSTOMER_ID = "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a";
const TENANT_ID = "f0555d1a-5da7-4d15-b864-a1c6b16458a8";

/**
 * POST endpoint to initiate an outbound call
 */
app.post("/", async (c) => {
  // Extract parameters from request body
  const { phoneNumberId, assistantId, customerNumber } =
    await c.req.json<any>();

  console.log(
    `reorderbot: Received request to place outbound call with 
    phoneNumberId: ${phoneNumberId}, 
    assistantId: ${assistantId}, 
    customerNumber: ${customerNumber}`
  );

  // Initialize agent configuration
  const agent: AgentConfig = {};

  try {
    // 1. Fetch tenants for verification/access control
    const tenantsRepository = createRepository("tenants");
    const tenants = (await tenantsRepository.getAll()) as TenantRow[];
    console.log("Successfully retrieved tenants:", tenants);

    // 2. Fetch and process customer's last order
    const proposedOrderResult = await fetchCustomerLastOrder(CUSTOMER_ID);

    if (proposedOrderResult?.data) {
      // Calculate order totals
      const orderWithTotals = calculateOrderTotals(proposedOrderResult.data);

      // Format order components and extract for the agent
      const formattedOrder = formatOrderComponents(orderWithTotals);
      agent.xmlCustomer = formattedOrder.xmlCustomer;
      agent.xmlCompany = formattedOrder.xmlCompany;
      agent.xmlProposedOrder = formattedOrder.xmlProposedOrder;

      console.log("\nExtracted customer:", agent.xmlCustomer);
      console.log("\nExtracted company:", agent.xmlCompany);
      console.log("\nProposed Order:", agent.xmlProposedOrder);
    }

    // 3. Fetch and process product specials
    const productSpecialsResult = await fetchProductSpecials(TENANT_ID);

    if (productSpecialsResult?.data) {
      // Calculate discounted prices
      const productsWithDiscounts = calculateDiscountedPrices(
        productSpecialsResult.data
      );

      // Format product specials for the agent
      agent.xmlProductSpecials = formatProductSpecials(productsWithDiscounts);
      console.log("\nPromotional Offers:", agent.xmlProductSpecials);
    }

    // 4. Fetch and process customer's favorite products
    const customerPreferencesResult = await fetchCustomerPreferences(
      CUSTOMER_ID
    );

    if (customerPreferencesResult?.data) {
      // Extract favorite product IDs
      const favoriteProductIds = extractFavoriteProductIds(
        customerPreferencesResult.data
      );

      if (favoriteProductIds.length > 0) {
        // Fetch favorite product details
        const favoriteProductsResult = await fetchFavoriteProducts(
          favoriteProductIds
        );

        if (favoriteProductsResult?.data) {
          // Format favorite products for the agent
          agent.xmlFavoriteProducts = formatFavoriteProducts(
            favoriteProductsResult.data
          );
          console.log("\nCustomer Favorite Items:", agent.xmlFavoriteProducts);
        }
      }
    }

    // 5. Configure the agent's tools
    agent.tool = tool_sendOrderPackageBySms;

    // 6. Build the agent's prompt from template file
    const agentFilePath = path.join(
      __dirname,
      "../../src/assistants/domain/acmecleaning.com/reorderbot/agent_reorderbot_gemini.md"
    );

    agent.prompt = buildPromptFromFile(agentFilePath, agent);
    console.log("Prompt built successfully");

    // 7. Create the assistant configuration
    const assistant = createAssistantConfig(agent);
    console.log("Assistant configuration created");

    // 8. Make the outbound call using VAPI
    const callResponse = await makeOutboundCall({
      phoneNumberId,
      assistant,
      customerNumber,
    });

    console.log("VAPI call successful:", callResponse.id);

    // TODO: Save the call ID to the database for reference

    // Return the call response to the client
    return c.json(callResponse, 200);
  } catch (error) {
    console.error("Error during call setup:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during call setup";

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
