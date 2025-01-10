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
import { assistantTable } from "../functionsDb/assistantTable/index";
import { env } from "process";
import path from "path";
import { Assistants } from "openai/resources/beta/assistants";

const demoPhoneNumber = envConfig.demo.phoneNumber;
const demoAgentType = envConfig.demo.agentType;
const demoAgentDir = envConfig.demo.agentDir;
const appUtils = envConfig.utils;
const defaultAgentDir = envConfig.utils.defaultAgentDir;

const vapi_CallTransient = `${envConfig.vapi.baseUrl}/call`;
const vapi_CallUpdatedAgent = `${envConfig.vapi.baseUrl}/call/phone`;
const test_formSubmission = "http://localhost:3000/api/testEndpoint";
const local_outboundTransient = "http://localhost:3000/api/outbound/transient";
const local_outboundAssistantOverides =
  "http://localhost:3000/api/outbound/assistantOverides";
const local_formSubmission = vapi_CallTransient;

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

    const demo = (body.demo as boolean) || true;
    let companyPhoneNumber = `+1${body.fromNumber}` || demoPhoneNumber;
    let agentType = body.agentType || demoAgentType;
    let companyAgentDir = body.companyAgentDir || defaultAgentDir;

    let vapiConnector: any = {};

    console.log("customerPhoneNumber:", customerPhoneNumber);
    console.log("companyPhoneNumber:", companyPhoneNumber);
    console.log("demoAgentType:", demoAgentType);
    console.log("agentType:", agentType);

    switch (agentType) {
      // ====================================
      case "transient":
        //
        vapiConnector = createVapiConnectorFromScratch(demo);
        updateVapiConnector(
          vapiConnector,
          companyPhoneNumber,
          customerPhoneNumber
        );

        console.log("transient > vapiConnector: ", vapiConnector);
        console.log("local_outboundTransient:", local_outboundTransient);

        const responseTransient = await fetch(local_outboundTransient, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vapiConnector),
        });

        const messageTransient =
          "Transient agent has been created and sent to /outbound/transient.";
        console.log(messageTransient);
        return c.json({ success: true, messageTransient });
        break;

      // ====================================
      case "assistantOverides":
        //
        // Get the assistant ID via 'To' phone number (company phone number)
        const assistantName = "default";
        const companyAssistantId =
          await assistantTable.findAssistantIDByNameAndPhoneNumber(
            assistantName,
            companyPhoneNumber
          );

        const assistantOverides = {
          assistantId: companyAssistantId,
          assistantOverrides: {
            variableValues: {
              name: "assistantOverides",
            },
          },
          customer: {
            number: customerPhoneNumber,
          },
          phoneNumberId: "your-phone-id",
        };

        // Create Call (POST /assistantOverides)
        console.log(
          "local_outboundAssistantOverides:",
          local_outboundAssistantOverides
        );

        const responseOverides = await fetch(local_outboundAssistantOverides, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vapiConnector),
        });

        const messageOverides =
          "Overides object for assistant created and sent to /outbound/assistantOverides.";
        console.log(messageOverides);
        return c.json({ success: true, messageOverides });
        break;

      // ====================================
      case "variableValues":
        //
        break;

      default:
        break;
    }

    console.log(
      ">> src/forms/index vapiConnector: \n",
      JSON.stringify(vapiConnector, null, 2)
    );

    // If this is a demo, wait for 5 seconds before making the call+
    // await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error("Error processing /submit request:", error);
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});

//============================================================================
// if (require.main === module) {
//   // Simulate a POST request to /submit
//   const simulatedRequest = {
//     req: {
//       json: async () => ({
//         fromNumber: "6042106553",
//         toNumber: "7787754146",
//         agentType: "Test Agent",
//         companyAgentDir: "test/agent/dir",
//         demo: true,
//       }),
//     },
//     json: (response: any, status: number) => {
//       console.log("Simulated response:", response);
//       console.log("Status:", status);
//     },
//   };

//   app.post("/submit", simulatedRequest);
// }

//============================================================================
const sendToOutboundTransient = async (c: any, vapiConnector: any) => {
  // Send POST request to another service
  try {
    const assistant = vapiConnector.assistant;
    //console.log('vapiConnector 443345:', JSON.stringify(vapiConnector, null, 2));
    console.log(
      "#################################################################################"
    );
    console.log("local_outboundTransient:", local_outboundTransient);

    const response = await fetch(local_outboundTransient, {
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
};

//============================================================================
interface VapiConnector {
  assistant?: any;
  phoneNumberId?: string;
  customer?: {
    number?: string;
  };
}

interface VapiParams {
  vapiEndpoint: string;
  demo: boolean;
}

const getVapiConnectorFromVapi = async (
  c: any,
  params: VapiParams
): Promise<VapiConnector> => {
  const { vapiEndpoint, demo } = params;

  console.log("FN: getVapiConnectorFromVapi");

  const agentReorder = "53ee94e7-b7ac-4579-91c8-d7a90fbc0dcd";
  const vapiAssistantEndpoint = `https://api.vapi.ai/assistant/${agentReorder}`;

  // Get Assistant (GET /assistant/:id)
  const response = await fetch(vapiAssistantEndpoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer f1dab3ba-7418-4253-bbc2-dbc8a4719811",
    },
  });

  const bodyGetVapiConnector = await response.json();
  console.log(bodyGetVapiConnector);

  console.log("bodyGetVapiConnector: ", bodyGetVapiConnector);

  // {
  //   "assistantId": "your-assistant-id",
  //   "assistantOverrides": {
  //     "variableValues": {
  //       "name": "John"
  //     }
  //   },
  //   "customer": {
  //     "number": "+1xxxxxxxxxx"
  //   },
  //   "phoneNumberId": "your-phone-id"
  // }

  const vapiConnectorWithAssistantOverides = {
    phoneId: "97166f4e-61a5-4c6c-b15f-c6a295076707",
    customer: {
      number: "+17787754146",
    },
    assistantId: "53ee94e7-b7ac-4579-91c8-d7a90fbc0dcd",
    assistantOverides: {
      model: {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              '## Overview\nYou are Mary, an AI assistant who helps customers review and modify their previous orders through voice and text messaging.\n\n## Available Tools\nsendSms({\n  from: string,\n  to: string,\n  message: string\n})\n\ncreateOrder({\n  customerID: string,\n  status: string,\n  items: Array<{\n    id: string,\n    name: string,\n    size: string,\n    quantity: string\n  }>\n})\n\nendCall()\n\ntransferCall()\n\n## Task Details\n\n### Introduction\n1. Decide: Is this a good time to talk?\n    - If No: Say "I will call back later. Goodbye." and use endCall()\n    - If Yes: Proceed to \'Create a New Order\'\n\n### Create a New Order\n1. Initialize Order\n    - Create currentOrderState as new object\n    - Copy all items from lastOrder to currentOrderState\n    - Say: "Please hold a moment while I send you a text of your last order."\n    - Send text using LAST_ORDER template. (Only use this template to Initialize Order.)\n\n2. Process Order Modifications\n    - Review currentOrderState items (names and quantities only)\n    - When customer requests changes:\n        * Update quantity in currentOrderState.items for specified product\n        * Confirm change verbally\n        * Create pending order using createOrder with currentOrderState.items\n        * Send text using PENDING_ORDER template. (Only use this template for Process Order Modifications.)\n    - Say: "Please review the pending order I just sent. Do you want to confirm the order or make changes?"\n    - If customer wants changes, return to start of step 2\n\n3. Confirm Order\n    - Send text using CONFIRMED_ORDER template. (Only use this template to Confirm Order.)\n    - Say: "I have confirmed your order and sent you a text of the items. Thank you. Goodbye."\n    - Use endCall()\n\n\n## Examples \n\n### Example Conversation\nMary: "Hello, this is Mary calling from Acme Supplies. Is this a good time to talk?"\n\nCustomer: "Yes"\n\nMary: "I\'m calling to check if you need to replenish any supplies from your last order. I\'m sending you a text of your last order as a reminder."\n\n[sends LAST_ORDER text]\n\nMary: "Let me know when you receive the text and we can review together."\n\nCustomer: "Yes, got it."\n\n[currentOrderState initialized with lastOrder items]\n\nMary: "Your last order included 3 units of toilet paper and 3 units of soap. Would you like to reorder the same, or make changes?"\n\nCustomer: "Actually, yes. We\'re running low on toilet paper. Could we increase that to 5 units?"\n\n[currentOrderState updated: toilet paper quantity changed to 5]\n\nMary: "Of course. So that would be 5 units of toilet paper and keep the soap at 3 units. Is that correct?"\n\nCustomer: "Yes, that\'s perfect."\n\nMary: "I\'ll update that order for you. I\'m sending you a text of the pending order."\n\n[sends PENDING_ORDER text]\n\nMary: "Please let me know when you receive it."\n\nCustomer: "Got it."\n\nMary: "Please review it and let me know if you want to make changes or confirm the order."\n\nCustomer: "Order confirmed"\n\nMary: "Thank you. I\'m sending you a confirmation text now."\n\n[sends CONFIRMED_ORDER text]\n\nMary: "Have a great rest of your day. Goodbye." ',
          },
        ],
        provider: "openai",
        temperature: 0.7,
      },
    },
  };

  console.log(
    "vapiConnectorWithAssistantOverides: ",
    vapiConnectorWithAssistantOverides
  );

  // Create Call (POST /call)
  const responseAssistantOverides = await fetch("https://api.vapi.ai/call", {
    method: "POST",
    headers: {
      Authorization: "Bearer 46dceb39-7a73-4f29-9e7c-2636c7143538",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      vapiConnectorWithAssistantOverides,
    }),
  });

  const result_responseAssistantOverides =
    await responseAssistantOverides.json();
  console.log("responseAssistantOverides: ", result_responseAssistantOverides);

  // Create Call (POST /call)
  // const response = await fetch("https://api.vapi.ai/call", {
  //   method: "POST",
  //   headers: {
  //     "Authorization": "Bearer f1dab3ba-7418-4253-bbc2-dbc8a4719811",
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     "assistantId": "53ee94e7-b7ac-4579-91c8-d7a90fbc0dcd",
  //     "phoneNumberId": "97166f4e-61a5-4c6c-b15f-c6a295076707",
  //     "assistantOverrides": {
  //       "firstMessage": "",
  //       "variableValues": {},
  //       "model": {
  //         "provider": "openai",
  //         "model": "gpt-4o",
  //         "temperature": 0,
  //         "tools": [],
  //         "toolIds": [],
  //         "messages": [
  //           {
  //             "content": "",
  //             "role": "system"
  //           }
  //         ]
  //       },
  //       "modelOutputInMessagesEnabled": false
  //     },
  //     "customer": {
  //       "number": "+17787754146"
  //     }
  //   }),
  // });

  // const body = await response.json();
  // console.log(body);

  // {
  //   "id": "53ee94e7-b7ac-4579-91c8-d7a90fbc0dcd",
  //   "orgId": "620aaa3f-ceb7-4e4f-9f14-f59a6e9bd593",
  //   "name": "Reorder",
  //   "voice": {
  //     "model": "sonic-english",
  //     "voiceId": "248be419-c632-4f23-adf1-5324ed7dbf1d",
  //     "provider": "cartesia",
  //     "fillerInjectionEnabled": false
  //   },
  //   "createdAt": "2024-11-07T16:42:02.598Z",
  //   "updatedAt": "2025-01-08T21:29:35.643Z",
  //   "model": {
  //     "model": "gpt-4o-mini",
  //     "toolIds": [
  //       "df69dcbb-bd32-41f7-b273-661eb2b569fd"
  //     ],
  //     "messages": [
  //       {
  //         "role": "system",
  //         "content": "## Overview\nYou are Mary, an AI assistant who helps customers review and modify their previous orders through voice and text messaging.\n\n## Available Tools\nsendSms({\n  from: string,\n  to: string,\n  message: string\n})\n\ncreateOrder({\n  customerID: string,\n  status: string,\n  items: Array<{\n    id: string,\n    name: string,\n    size: string,\n    quantity: string\n  }>\n})\n\nendCall()\n\ntransferCall()\n\n## Task Details\n\n### Introduction\n1. Decide: Is this a good time to talk?\n    - If No: Say \"I will call back later. Goodbye.\" and use endCall()\n    - If Yes: Proceed to 'Create a New Order'\n\n### Create a New Order\n1. Initialize Order\n    - Create currentOrderState as new object\n    - Copy all items from lastOrder to currentOrderState\n    - Say: \"Please hold a moment while I send you a text of your last order.\"\n    - Send text using LAST_ORDER template. (Only use this template to Initialize Order.)\n\n2. Process Order Modifications\n    - Review currentOrderState items (names and quantities only)\n    - When customer requests changes:\n        * Update quantity in currentOrderState.items for specified product\n        * Confirm change verbally\n        * Create pending order using createOrder with currentOrderState.items\n        * Send text using PENDING_ORDER template. (Only use this template for Process Order Modifications.)\n    - Say: \"Please review the pending order I just sent. Do you want to confirm the order or make changes?\"\n    - If customer wants changes, return to start of step 2\n\n3. Confirm Order\n    - Send text using CONFIRMED_ORDER template. (Only use this template to Confirm Order.)\n    - Say: \"I have confirmed your order and sent you a text of the items. Thank you. Goodbye.\"\n    - Use endCall()\n\n\n## Examples \n\n### Example Conversation\nMary: \"Hello, this is Mary calling from Acme Supplies. Is this a good time to talk?\"\n\nCustomer: \"Yes\"\n\nMary: \"I'm calling to check if you need to replenish any supplies from your last order. I'm sending you a text of your last order as a reminder.\"\n\n[sends LAST_ORDER text]\n\nMary: \"Let me know when you receive the text and we can review together.\"\n\nCustomer: \"Yes, got it.\"\n\n[currentOrderState initialized with lastOrder items]\n\nMary: \"Your last order included 3 units of toilet paper and 3 units of soap. Would you like to reorder the same, or make changes?\"\n\nCustomer: \"Actually, yes. We're running low on toilet paper. Could we increase that to 5 units?\"\n\n[currentOrderState updated: toilet paper quantity changed to 5]\n\nMary: \"Of course. So that would be 5 units of toilet paper and keep the soap at 3 units. Is that correct?\"\n\nCustomer: \"Yes, that's perfect.\"\n\nMary: \"I'll update that order for you. I'm sending you a text of the pending order.\"\n\n[sends PENDING_ORDER text]\n\nMary: \"Please let me know when you receive it.\"\n\nCustomer: \"Got it.\"\n\nMary: \"Please review it and let me know if you want to make changes or confirm the order.\"\n\nCustomer: \"Order confirmed\"\n\nMary: \"Thank you. I'm sending you a confirmation text now.\"\n\n[sends CONFIRMED_ORDER text]\n\nMary: \"Have a great rest of your day. Goodbye.\"\n\n### Reference Objects\n#### Company\n{\n  \"companyID\": {{companyID}},\n  \"companyName\": {{companyName}},\n  \"companyPhone\": {{companyPhone}}\n}\n\n#### Customer\n{{customer}}\n\n#### LastOrder\n{{lastOrder}}\n\n#### CurrentDate\n{{currentDate}}\n\n#### CurrentOrderState\n// This is a dynamic object structure, not actual data\n{\n  \"items\": Array<{\n    \"id\": string,\n    \"name\": string,\n    \"size\": string,\n    \"quantity\": string\n  }>\n}\n\n## SMS Templates\n\n### LAST_ORDER Template\n{\n  \"message\": \"LAST ORDER\\n\nOrderID: ${lastOrder.orderID}\\n\nFor: ${customer.name}\\n\nOrder date: ${lastOrder.orderDate}\\n\\n\n${formatItems(lastOrder.items)}\\n\\n\nAnything you wish changed? Or,\nis it OK to reorder the same?\",\n  \"from\": \"${company.companyPhone}\",\n  \"to\": \"${customer.cell}\"\n}\n\n### PENDING_ORDER Template\n{\n  \"message\": \"PENDING ORDER\\n\n${formatItems(currentOrderState.items)}\\n\\n\nConfirm or make changes?\\n\n(Order PENDING till confirmed.)\",\n  \"from\": \"${company.companyPhone}\",\n  \"to\": \"${customer.cell}\"\n}\n\n### CONFIRMED_ORDER Template\n{\n  \"message\": \"CONFIRMED ORDER\\n\nOrderID: ${newOrder.orderID}\\n\nFor: ${customer.name}\\n\nOrder date: ${currentDate}\\n\\n\n${formatItems(currentOrderState.items)}\\n\\n\nThis order is CONFIRMED.\",\n  \"from\": \"${company.companyPhone}\",\n  \"to\": \"${customer.cell}\"\n}\n\nWhere formatItems() formats each item as:\n\"- ${item.quantity} units ${item.name}: ${item.size}\"\n\n\n## Guidelines\n\n### 1. Conversation Management\n- Follow task details sequence precisely\n- Use example conversation flow as reference\n- Only speak phrases marked with \"Say\" directive\n- Maintain professional, friendly tone\n- Return to script naturally if conversation deviates\n- Discuss only item names and quantities by voice unless specifically asked\n- Send text messages before discussing any changes\n- Confirm receipt of each text message\n- Verify all changes before confirmation\n\n### 2. Order Processing\n- Use standardized template names:\n  - LAST_ORDER\n  - PENDING_ORDER\n  - CONFIRMED_ORDER\n- Send texts in correct sequence:\n  1. Last order review\n  2. Pending order changes\n  3. Final confirmation\n- Create new orders only after explicit customer confirmation\n\n### 3. Technical Operations\n- Use provided tools:\n  - sendSms()\n  - createOrder()\n  - endCall()\n  - transferCall()\n- Assume successful SMS delivery\n- Transfer to human representative when requested\n- End calls using endCall()\n\n### 4. Error Handling\n- Message sending fails:\n  1. Inform customer\n  2. Retry sending\n  3. Transfer if repeated failure\n- Order creation fails:\n  1. Apologize to customer\n  2. Transfer to human representative\n- Customer unresponsive:\n  1. Confirm presence\n  2. Wait for response\n  3. End call if no response after two attempts\n\n### 5. Documentation Notation\n- Use \"Say\" for verbal communication\n- Use \"Do\" for system actions\n- Use \"Decide\" for decision points\n- Return to previous steps when indicated\n- Follow numbered sequences in order\n- Complete all sub-steps before proceeding"
  //       }
  //     ],
  //     "provider": "openai",
  //     "temperature": 0.7
  //   },
  //   "firstMessage": "Hi ((Customer_FirstName}}, I'm Agentus an AI agent for Aaron Services calling to check on your level of supplies.",
  //   "transcriber": {
  //     "model": "nova-2",
  //     "language": "en",
  //     "provider": "deepgram"
  //   },
  //   "clientMessages": [
  //     "transcript",
  //     "hang",
  //     "function-call",
  //     "speech-update",
  //     "metadata",
  //     "transfer-update",
  //     "conversation-update"
  //   ],
  //   "serverMessages": [
  //     "end-of-call-report",
  //     "status-update",
  //     "hang",
  //     "function-call"
  //   ],
  //   "serverUrl": "https://hook.us1.make.com/xobap694wmcu1gutlx3whv433ukyi1tc",
  //   "backchannelingEnabled": false,
  //   "backgroundDenoisingEnabled": false,
  //   "messagePlan": {
  //     "idleMessages": [
  //       "I'm still here if you need assistance.",
  //       "Are you still there?",
  //       "How can I assist you further?"
  //     ]
  //   },
  //   "isServerUrlSecretSet": false
  // }

  // return responseAssistantOverides;

  return c.json(result_responseAssistantOverides, 200);
};

//============================================================================
const EditVapiConnectorViaAssistantOverides = (
  vapiConnector: any,
  companyPhoneNumber: string,
  customerPhoneNumber: string
) => {};

//============================================================================
const EditVapiConnectorViaVariableValues = (
  vapiConnector: any,
  companyPhoneNumber: string,
  customerPhoneNumber: string
) => {};

//============================================================================
const createVapiConnectorFromScratch = (demo: boolean) => {
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
    // Get the company parameters from the db (companyPhoneNumber, agentType)
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

//============================================================================
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
  const currentDate = new Date();
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

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
    formattedDate
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

  const formattedItems = LAST_ORDER.items
    .map((item) => `- ${item.quantity} units ${item.name}: ${item.size}`)
    .join("\n");

  console.log(formattedItems);

  // Update systemPrompt LAST_ORDER
  const systemPromptWithVariables = systemPromptWithLastOrder
    .replace(/{{lastOrder.orderID}}/g, LAST_ORDER.orderID)
    .replace(/{{lastOrder.orderID}}/g, LAST_ORDER.orderDate)
    .replace(/{{customer.name}}/g, CUSTOMER.name)
    .replace(/{{customer.cell}}/g, CUSTOMER.cell)
    .replace(/{{company.companyPhone}}/g, COMPANY.phone.number)
    .replace(/{{formatItems(lastOrder.items)}}/g, formattedItems);

  // Replace systemPrompt in assistant
  assistant.model.systemPrompt = systemPromptWithVariables;

  const vapiPhoneNumberId = COMPANY.phone.vapiId;
  vapiConnector.phoneNumberId = vapiPhoneNumberId;

  vapiConnector.customer.number = CUSTOMER.cell;
};

export { app as formsRoute };
