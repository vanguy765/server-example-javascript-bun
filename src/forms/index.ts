// src/forms/index.ts

import { Hono } from "hono";
import { inspect } from 'util';
import { envConfig } from "../config/env.config";
import { cellphoneFormHTML } from "./cellphone";
import { Bindings } from "../types/hono.types";
import { join } from 'path'; // Import join from path module
import  updateSystemPrompt  from "../assistants/playground/e_testAssistant/";
const app = new Hono<{ Bindings: Bindings }>();

// console.log("ENTRY src/forms/index.ts");

// Middleware to log every request
app.use("*", async (c, next) => {
//  console.log(`>>> Request at src/forms/index.ts: ${c.req.method} ${c.req.url}`);
//   const body = await c.req.json();
//   console.log("Middleware check body...:", body);
  await next();
});

//============================================================================
// Serve the form
app.get("/", (c) => {
  return c.html(cellphoneFormHTML);
});

//============================================================================
app.post("/", async (c) => {
    console.log(`(TESTING 14256) POST Hello World!`);
    const body = await c.req.json();
    console.log("Request Body 14256:", body);
    return c.text("(TESTING 14256) POST Hello World!");
  });


//============================================================================
// Handle 'Cell Phone Number Submission' form submission
// from src/forms/cellphone.ts
app.post("/submit", async (c) => {
    



  const body = await c.req.json();
  // const phoneNumberId = findPhoneNumberInDb;
  const customerNumber = `+1${body.phoneNumber}`;


  // console.log('__dirname:', __dirname);

// Example usage
const pathPromptFile = join(__dirname, '../assistants/playground/e_testAssistant/e_testPrompt3.md');
const pathGuidelinesFile = join(__dirname, '../assistants/playground/e_testAssistant/e_testGuidelines.md');
const pathLastOrderFile = join(__dirname, '../assistants/playground/e_testAssistant/e_testLastOrder.json');
const pathFunctionsFile = join(__dirname, '../assistants/playground/e_testAssistant/e_testFunctions.json');
const pathFirstMessageFile = join(__dirname, '../assistants/playground/e_testAssistant/e_testFirstMessage.md');
const pathAssistFile = join(__dirname, '../assistants/playground/e_testAssistant/e_testAssist.json');
const SystemPromptUpdated = updateSystemPrompt(
    pathAssistFile, pathPromptFile, 
    pathFunctionsFile, pathFirstMessageFile, 
    pathGuidelinesFile, pathLastOrderFile
) as any;


const customer = { "customer": {
    "number": customerNumber
    }
}

const findPhoneNumberInDb_phoneNumberId = "97166f4e-61a5-4c6c-b15f-c6a295076707";
const phoneNumberId = { "phoneNumberId": findPhoneNumberInDb_phoneNumberId };
SystemPromptUpdated.customer = customer.customer;
SystemPromptUpdated.phoneNumberId = phoneNumberId.phoneNumberId;


// console.log('SystemPromptUpdated 4445:', JSON.stringify(SystemPromptUpdated, null, 2));

  // Wait for 5 seconds
  // await new Promise(resolve => setTimeout(resolve, 5000));

  const vapi_formCellPhoneNumberSubmission = `${envConfig.vapi.baseUrl}/call`;
  const test_formCellPhoneNumberSubmission = "http://localhost:3000/api/testEndpoint";
  const endpoint_formCellPhoneNumberSubmission = vapi_formCellPhoneNumberSubmission;
  
  // Send POST request to another service
  try {
    const assistant = SystemPromptUpdated.assistant;
        //console.log('SystemPromptUpdated 443345:', JSON.stringify(SystemPromptUpdated, null, 2));
        console.log('#################################################################################');
        console.log('endpoint_formCellPhoneNumberSubmission:', endpoint_formCellPhoneNumberSubmission);

        const response = await fetch(endpoint_formCellPhoneNumberSubmission, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${envConfig.vapi.apiKey}`,
        },        
        body: JSON.stringify(SystemPromptUpdated),
        });
        
        if (!response.ok) {
            return c.json({ success: false, error: 'Failed to forward request' }, 500);
        }

        const data = await response.json();
        console.log(data);
        return c.json({ success: true });


  } catch (error) {
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});



export { app as formsRoute };










