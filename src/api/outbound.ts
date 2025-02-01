// src/api/outbound.ts
import { Hono } from "hono";
import { envConfig } from "../config/env.config";
import { Bindings } from "../types/hono.types";
import { inspect } from "util";
import { join } from "path";
const fs = require("fs");

import e_testAssist from "../assistants/playground/e_testAssistant/indexJUNK";

import assembleAssistants from "./assistants/utils/assembleAssistant";

const app = new Hono<{ Bindings: Bindings }>();

const availableAssistants = {
  e_testAssist: e_testAssist,
};

// console.log('availableAssistants.c_testSms:', availableAssistants.c_testSms);

// Use the 'From' number from the request body to determine the companyId, companyName,
// and default assistantName from the companyTable in the local database.

// All of the assistants are in the src/assistants/ directory, companyName/ folder
// If a folder in src/assistants/ matches companyName, import all the files in the folder
// to constants of similar names.

// ########################################################################
// CHANGE THIS TO THE DEFAULT ASSISTANT YOU WANT TO USE
// ACTUAL ASSISTANT OBJECTS ARE DEFINED IN src/assistants/playground
// SELECTION OF ASSISTANT IS BY ASSISTANT NAME GIVEN IN THE REQUEST BODY
const defaultAssistantName = "e_testAssist";

// ########################################################################
// CHANGE THIS TO THE SITE YOU WANT TO USE (FOR TESTING OR PRODUCTION)
const productionSite = `${envConfig.vapi.baseUrl}/call`;
const testSite = "https://webhook.site/8ff7ab34-3192-497f-83f4-c41a0f8a18ba";
const useSite = productionSite;

// ########################################################################
// CHANGE THIS TO THE DEFAULT VAPI-PHONE-NUMBER-ID
// ACTUAL NUMBER IN PRODUCTION IS ASSOCIATED WITH THE COMPANY ON WHOSE
// BEHALF THE CALL IS BEING MADE (See companyTable in local DB.)
// LOCATE COMPANY IN DB BY PHONE NUMBER GIVEN IN REQUEST BODY.
const defaultPhoneNumberId = "97166f4e-61a5-4c6c-b15f-c6a295076707";

// ########################################################################
// CONSIDER CHANGING OPENAI-API-KEY TO ONE SPECIFIC TO THE COMPANY ON WHOSE
// BEHALF THE CALL IS BEING MADE (See companyTable in local DB.)

// Middleware to log every request
app.use("*", async (c, next) => {
  console.log(
    `>> Request at src/api/outbound.ts: ${c.req.method} ${c.req.url}`
  );
  await next();
});

// ########################################################################
app.get("/", (c) => {
  console.log(`GET src/api/outbound.ts Hello World!`);
  return c.text("GET src/api/outbound.ts Hello World!");
});

// ########################################################################
app.post("/", async (c) => {
  // Extract phoneNumberId, assistantId, and customerNumber from the request body
  // Use DEFAULTS as required *************************************

  console.log(`POST src/api/outbound.ts Hello World!`);

  const {
    phoneNumberId = defaultPhoneNumberId,
    assistantName = defaultAssistantName,
    customerNumber,
  } = await c.req.json();

  // Choose the assistant to use for the outbound call
  const assistant =
    availableAssistants[assistantName as keyof typeof availableAssistants];

  try {
    /**!SECTION
     * Handle Outbound Call logic here.
     * This can initiate an outbound call to a customer's phonenumber using Vapi.
     */

    // Get the prompt for the assistant

    const headers = {
      "Content-Type": "application/json", // 'Content-Type' must be quoted because it contains a hyphen
      Authorization: `Bearer ${envConfig.vapi.apiKey}`, // 'Authorization' does not need to be quoted
    };

    const body = {
      phoneNumberId: phoneNumberId,
      assistant: prompt,
      customer: {
        number: customerNumber,
      },
    };

    console.log("=================================");
    console.log("prompt:", prompt);
    console.log("body:", body);
    console.log("body.assistant:", body.assistant);
    console.log("useSite:", useSite);
    console.log("defaultPhoneNumberId: ", defaultPhoneNumberId);
    console.log("defaultPhoneNumberId: ", defaultPhoneNumberId);

    // Make a POST request to the Vapi API or test site
    const response = await fetch(useSite, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `src/api/outbound.ts ${useSite} \nHTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(`==========`);
    console.log(`response from ${useSite}:`, JSON.stringify(data, null, 2));

    return c.json(data, 200);
  } catch (error: any) {
    return c.json(
      {
        message: "src/api/outbound.ts Failed to place outbound call",
        error: error.message,
      },
      500
    );
  }
});

// ########################################################################
app.post("/transient", async (c) => {
  try {
    /**!SECTION
     * Handle Outbound Call logic here.
     * This can initiate an outbound call to a customer's phonenumber using Vapi.
     */

    // Get the prompt for the assistant
    const body = await c.req.json();

    const headers = {
      "Content-Type": "application/json", // 'Content-Type' must be quoted because it contains a hyphen
      Authorization: `Bearer ${envConfig.vapi.apiKey}`, // 'Authorization' does not need to be quoted
    };

    console.log("body:", body);
    console.log("useSite:", useSite);
    console.log("headers:", headers);

    // Make a POST request to the Vapi API or test site
    const response = await fetch(useSite, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `src/api/outbound.ts ${useSite} \nHTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(`==========`);
    console.log(`response from ${useSite}:`, JSON.stringify(data, null, 2));

    return c.json(data, 200);
  } catch (error: any) {
    return c.json(
      {
        message: "src/api/outbound.ts Failed to place outbound call",
        error: error.message,
      },
      500
    );
  }
});

// ########################################################################
app.post("/assistantOverrides", async (c) => {
  try {
    // This endpoint is used to update the variables in a Vapi assistant
    // The passed in body should contain everything as required by
    // https://docs.vapi.ai/assistants/dynamic-variables

    const body = await c.req.json();

    const headers = {
      "Content-Type": "application/json", // 'Content-Type' must be quoted because it contains a hyphen
      Authorization: `Bearer ${envConfig.vapi.apiKey}`, // 'Authorization' does not need to be quoted
    };

    // Make the POST request to update variables in assistant and make the phone call
    const useSite = `${envConfig.vapi.baseUrl}/call/phone`;

    console.log(
      `src/api/outbound.ts >> assistantOverrides POST ====================`
    );
    console.log("useSite:", useSite);
    console.log("headers:", headers);
    console.log("body:", body);

    const response = await fetch(useSite, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `src/api/outbound.ts >> outbound/assistantOverrides \n
        ${useSite} \n
        HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();

    console.log(`response from ${useSite}:`, JSON.stringify(data, null, 2));
    return c.json(data, 200);
  } catch (error: any) {
    return c.json(
      {
        message:
          "src/api/outbound.ts >> updateAgent Failed to place outbound call",
        error: error.message,
      },
      500
    );
  }
});

export { app as outboundRoute };
