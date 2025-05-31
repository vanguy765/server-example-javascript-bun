/**
 * VAPI Service
 *
 * This module provides functions for interacting with the VAPI voice API service
 */

import { envConfig } from "../../config/env.config";

/**
 * Configuration for a voice call
 */
export interface CallConfig {
  phoneNumberId: string;
  assistant: any;
  customerNumber: string;
}

/**
 * Makes an outbound call using the VAPI service
 *
 * @param config - Call configuration including phone number and assistant
 * @returns A promise with the API response
 * @throws Error if the API call fails
 */
export async function makeOutboundCall(config: CallConfig) {
  const { phoneNumberId, assistant, customerNumber } = config;

  const response = await fetch(`${envConfig.vapi.baseUrl}/call/phone`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${envConfig.vapi.apiKey}`,
    },
    body: JSON.stringify({
      phoneNumberId: phoneNumberId,
      assistant: assistant,
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

  return await response.json();
}
