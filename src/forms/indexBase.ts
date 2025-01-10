// src/forms/index.ts

import { Hono } from "hono";
import { inspect } from "util";
import { envConfig } from "../config/env.config";
import { cellphoneFormHTML } from "./cellphone";
import { Bindings } from "../types/hono.types";
import { join } from "path"; // Import join from path module
import updateSystemPrompt from "../assistants/playground/e_testAssistant";

import { orderTable } from "../functionsDb/orderTable/index";
import { companyTable } from "../functionsDb/companyTable/index";
import { customerTable } from "../functionsDb/customerTable/index";
import { env } from "process";
import path from "path";

const demoPhoneNumber = envConfig.demo.phoneNumber;
const demoAgentName = envConfig.demo.agentName;
const demoAgentDir = envConfig.demo.agentDir;
const appUtils = envConfig.utils;
const defaultAgentDir = envConfig.utils.defaultAgentDir;

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
  console.log(`(TESTING 1425644) POST Hello World!`);
  const body = await c.req.json();
  console.log("Request Body 14256:", body);
  return c.text("(TESTING 14666256) POST Hello World!");
});

//============================================================================
// Handle 'Cell Phone Number Submission' form submission
// from src/forms/cellphone.ts
app.post("/submit", async (c) => {
  try {
    const body = await c.req.json();
    const customerPhoneNumber = `+1${body.toNumber}`;

    console.log("body: ", body);

    const demo = (body.demo as boolean) || true;
    let companyPhoneNumber = `+1${body.fromNumber}` || demoPhoneNumber;
    let companyAgentName = body.companyAgentName || demoAgentName;
    let companyAgentDir = body.companyAgentDir || defaultAgentDir;

    const vapiConnector = getVapiConnector(demo);

    console.log(
      ">> src/forms/index vapiConnector: \n",
      JSON.stringify(vapiConnector, null, 2)
    );
    console.log("customerPhoneNumber:", customerPhoneNumber);
    console.log("companyPhoneNumber:", companyPhoneNumber);

    updateVapiConnector(vapiConnector, companyPhoneNumber, customerPhoneNumber);

    // If this is a demo, wait for 5 seconds before making the call+
    // await new Promise(resolve => setTimeout(resolve, 5000));

    const vapi_formCellPhoneNumberSubmission = `${envConfig.vapi.baseUrl}/call`;
    const test_formCellPhoneNumberSubmission =
      "http://localhost:3000/api/testEndpoint";
    const endpoint_formCellPhoneNumberSubmission =
      vapi_formCellPhoneNumberSubmission;
    const endpoint_outboundTransient =
      "http://localhost:3000/api/outbound/transient";

    console.log("vapiConnector:", vapiConnector);

    // Send POST request to another service
    try {
      const assistant = vapiConnector.assistant;
      //console.log('vapiConnector 443345:', JSON.stringify(vapiConnector, null, 2));
      console.log(
        "#################################################################################"
      );
      console.log("endpoint_outboundTransient:", endpoint_outboundTransient);

      const response = await fetch(endpoint_outboundTransient, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${envConfig.vapi.apiKey}`,
        },
        body: JSON.stringify(vapiConnector),
      });

      if (!response.ok) {
        console.error("Failed to forward request:", response.statusText);
        return c.json(
          { success: false, error: "Failed to forward request" },
          500
        );
      }

      const data = await response.json();
      console.log("data.id:", data.id);

      return c.json({ success: true });
    } catch (error) {
      console.error("Error during fetch:", error);
      return c.json({ success: false, error: (error as Error).message }, 500);
    }
  } catch (error) {
    console.error("Error processing /submit request:", error);
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});

if (require.main === module) {
  // Simulate a POST request to /submit
  const simulatedRequest = {
    req: {
      json: async () => ({
        fromNumber: "6042106553",
        toNumber: "7787754146",
        companyAgentName: "Test Agent",
        companyAgentDir: "test/agent/dir",
        demo: true,
      }),
    },
    json: (response: any, status: number) => {
      console.log("Simulated response:", response);
      console.log("Status:", status);
    },
  };

  app.post("/submit", simulatedRequest);
}

const getVapiConnector = (demo: boolean) => {
  // For testing purposes
  let testPath = "../assistants/playground/e_testAssistant";
  let testParams = {
    pathSystemPromptFile: "e_testPrompt3.md",
    pathFirstMessageFile: "e_testFirstMessage.md",
    pathGuidelinesFile: "e_testGuidelines.md",
    assistantWrapperFile: "e_testAssist.json",
    pathFunctionsFile: "e_testFunctions.json",
  };

  // For production
  // Standardize filepath names and call to db NOT required
  if (!demo) {
    // Get the company parameters from the db (companyPhoneNumber, companyAgentName)
    // testPath = "";
    // testParams = {
    //     pathSystemPromptFile: db filepath to prompt.md,
    //     pathFirstMessageFile: 'e_testFirstMessage.md',
    //     pathGuidelinesFile: 'e_testGuidelines.md',
    //     assistantWrapperFile: 'e_testAssist.json',
    //     pathFunctionsFile: 'e_testFunctions.json'
    // };
  }

  // If the TEXT for the systemPrompt, firstMessage, guidelines, and functions are in folders/files
  const basePath = path.resolve(__dirname, testPath);
  const pathSystemPromptFile = path.join(
    basePath,
    testParams.pathSystemPromptFile
  );
  const pathFirstMessageFile = path.join(
    basePath,
    testParams.pathFirstMessageFile
  );
  const pathGuidelinesFile = path.join(basePath, testParams.pathGuidelinesFile);
  const assistantWrapperFile = path.join(
    basePath,
    testParams.assistantWrapperFile
  );
  const pathFunctionsFile = path.join(basePath, testParams.pathFunctionsFile);

  // If the TEXT for the systemPrompt, firstMessage, guidelines, and functions are in folders/files
  // Else read the TEXT from the db directly
  return updateSystemPrompt({
    pathSystemPromptFile: pathSystemPromptFile,
    pathFirstMessageFile: pathFirstMessageFile,
    pathGuidelinesFile: pathGuidelinesFile,
    assistantWrapperFile: assistantWrapperFile,
    pathFunctionsFile: pathFunctionsFile,
  });
};

const updateVapiConnector = (
  vapiConnector: any,
  companyPhoneNumber: string,
  customerPhoneNumber: string
) => {
  // ** Get the company parameters from the db using companyPhoneNumber passed in the request
  const COMPANY = companyTable.getCompany(companyPhoneNumber);

  // ** Get the customer ID from the request, or from the DB using customerPhoneNumber
  const CUSTOMER = customerTable.getCustomer(customerPhoneNumber);

  // Mock the last order ID, date and line items for this customer from the db
  const LAST_ORDER = orderTable.getLastOrder(CUSTOMER.ID);

  // Update the CurrentDate in assistantWrapper
  const currentDate = new Date().toISOString();

  // Reference systemPrompt from vapiConnector
  const assistant = vapiConnector.assistant;
  const systemPrompt = assistant.model.systemPrompt;

  // Update systemPrompt companyParameters
  const systemPromptWithCompany = systemPrompt
    .replace(/{{companyName}}/g, COMPANY.name)
    .replace(/{{companyPhone}}/g, COMPANY.phone.number)
    .replace(/{{companyID}}/g, COMPANY.ID);

  // Update systemPrompt currentDate
  const systemPromptWithDate = systemPromptWithCompany.replace(
    /{{currentDate}}/g,
    currentDate
  );

  // Update systemPrompt LAST_ORDER
  const systemPromptWithCustomer = systemPromptWithDate.replace(
    /{{customer}}/g,
    JSON.stringify(CUSTOMER)
  );

  // Update systemPrompt LAST_ORDER
  const systemPromptWithLastOrder = systemPromptWithCustomer.replace(
    /{{lastOrder}}/g,
    JSON.stringify(LAST_ORDER)
  );

  // Replace systemPrompt in assistant
  assistant.model.systemPrompt = systemPromptWithLastOrder;

  const vapiPhoneNumberId = COMPANY.phone.vapiId;
  vapiConnector.phoneNumberId = vapiPhoneNumberId;

  vapiConnector.customer.number = CUSTOMER.cell;
};

export { app as formsRoute };
