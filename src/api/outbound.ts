// src/api/outbound.ts
import { Hono } from "hono";
import { envConfig } from "../config/env.config";
import { Bindings } from "../types/hono.types";
import { inspect } from 'util';
import { join } from 'path'; // Impor
const fs = require('fs');




 import e_testAssist from "../assistants/playground/e_testAssistant/indexJUNK";




const app = new Hono<{ Bindings: Bindings }>();

const availableAssistants = {
  e_testAssist: e_testAssist
};

// console.log('availableAssistants.c_testSms:', availableAssistants.c_testSms);




// ########################################################################
// CHANGE THIS TO THE DEFAULT ASSISTANT YOU WANT TO USE
// ACTUAL ASSISTANT OBJECTS ARE DEFINED IN src/assistants/playground
// SELECTION OF ASSISTANT IS BY ASSISTANT NAME GIVEN IN THE REQUEST BODY
const defaultAssistantName = "e_testAssist";

// ########################################################################
// CHANGE THIS TO THE SITE YOU WANT TO USE (FOR TESTING OR PRODUCTION)
const productionSite = `${envConfig.vapi.baseUrl}/call`;
const testSite = "https://webhook.site/8ff7ab34-3192-497f-83f4-c41a0f8a18ba";
const useSite = testSite;

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
  console.log(`>> Request at src/api/outbound.ts: ${c.req.method} ${c.req.url}`);
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
  const { 
    phoneNumberId = defaultPhoneNumberId, 
    assistantName = defaultAssistantName, 
    customerNumber 
  } = await c.req.json();

  // Choose the assistant to use for the outbound call
  // const assistant = availableAssistants[assistantName as keyof typeof availableAssistants];  
  const assistant = availableAssistants[assistantName as keyof typeof availableAssistants];
  try {
    /**!SECTION
     * Handle Outbound Call logic here.
     * This can initiate an outbound call to a customer's phonenumber using Vapi.
     */

    console.log("===================================================");
    console.log("===================================================");
    console.log("defaultPhoneNumberId: ", defaultPhoneNumberId);
    console.log("defaultAssistantName:", defaultAssistantName);
    // console.log("assistant:", assistant);
    // console.log("phoneNumberId: ", phoneNumberId);
    // console.log("customerNumber:", customerNumber);

    const headers = {
      "Content-Type": "application/json", // 'Content-Type' must be quoted because it contains a hyphen
      Authorization: `Bearer ${envConfig.vapi.apiKey}`, // 'Authorization' does not need to be quoted
    };

    // const body = {
    //   phoneNumberId: phoneNumberId,
    //   assistant: assistant,
    //   customer: {
    //     number: customerNumber,
    //   },
    // };

    console.log("Making a POST request to: ", useSite);
    //  console.log("headers:", headers);
    //  console.log("body:", body);
    // console.log("assistant:", assistant);

    const body = {
      phoneNumberId: phoneNumberId,
      assistant: prompt,
      customer: {
        number: customerNumber,
      },
    };

console.log('=================================');
console.log("prompt:", prompt);
console.log("body:", body);
console.log("body.assistant:", body.assistant);
console.log('useSite:', useSite);



    // Make a POST request to the Vapi API or test site
    const response = await fetch(useSite, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });


    if (!response.ok) {
      throw new Error(`src/api/outbound.ts ${useSite} \nHTTP error! status: ${response.status}`);
    }


    console.log(`==========`);
    const data = await response.json();
    console.log(`response from ${useSite}:`, JSON.stringify(data, null, 2));

    console.log(`response from ${useSite}:`);
    console.dir(data, { depth: null, colors: true });
    //console.log(`response from ${useSite}: ${data}`);

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

export { app as outboundRoute };
