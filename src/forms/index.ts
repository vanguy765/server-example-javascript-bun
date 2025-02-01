// src/forms/index.ts

import { Hono } from "hono";
import { inspect } from "util";
import { envConfig } from "../config/env.config";
import { cellphoneFormHTML } from "./cellphone";
import { Bindings } from "../types/hono.types";
import { join } from "path"; // Import join from path module
import {
  createVapiSysPromptPlus,
  updateAssistantOverridesObject,
} from "./utils";

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

const local_outboundTransient = envConfig.endpoint.local_outboundTransient;
const local_outboundAssistantOverrides =
  envConfig.endpoint.local_outboundAssistantOverrides;

const test_formSubmission = "http://localhost:3000/api/testEndpoint";
const local_formSubmission = test_formSubmission;

const app = new Hono<{ Bindings: Bindings }>();

console.log("=================================");
console.log("src/forms/index.ts");
console.log("=================================");

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
  //
  console.log("=================================");
  console.log("endpoint: submit");
  console.log("=================================");
  try {
    const body = await c.req.json();
    const customerPhoneNumber = `+1${body.toNumber}`;

    const demo = (body.demo as boolean) || true;
    let companyPhoneNumber = `+1${body.fromNumber}` || demoPhoneNumber;
    let agentType = body.agentType || demoAgentType;
    let companyAgentDir = body.companyAgentDir || defaultAgentDir;

    let AssistantOverridesTemplate: any = {};

    console.log("customerPhoneNumber:", customerPhoneNumber);
    console.log("companyPhoneNumber:", companyPhoneNumber);
    console.log("demoAgentType:", demoAgentType);
    console.log("agentType:", agentType);

    switch (agentType) {
      // ====================================
      case "transient":
        //
        console.log("=================================");
        console.log("switch: transient");
        console.log("=================================");
        AssistantOverridesTemplate = createVapiSysPromptPlus(demo);

        updateAssistantOverridesObject(
          AssistantOverridesTemplate,
          companyPhoneNumber,
          customerPhoneNumber
        );

        console.log(
          "transient > AssistantOverridesTemplate: ",
          AssistantOverridesTemplate
        );
        console.log("local_outboundTransient:", local_outboundTransient);

        const responseTransient = await fetch(local_outboundTransient, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(AssistantOverridesTemplate),
        });

        const messageTransient =
          "Transient agent has been created and sent to /outbound/transient.";
        console.log(messageTransient);
        return c.json({ success: true, messageTransient });
        break;

      // ====================================
      case "assistantOverrides":
        console.log("=================================");
        console.log("switch: assistantOverrides");
        console.log("=================================");
        //
        // Get the assistant ID via 'To' phone number (company phone number)
        const assistantName = "default";
        const companyAssistantId =
          await assistantTable.findAssistantIDByNameAndPhoneNumber(
            assistantName,
            companyPhoneNumber
          );

        const vapiPhoneId = await assistantTable.findVapiPhoneIDByPhoneNumber(
          companyPhoneNumber
        );

        const OverridesObject = updateOverridesTemplate(
          companyPhoneNumber,
          customerPhoneNumber
        );

        const assistantOverrides = {
          assistantId: companyAssistantId,
          assistantOverrides: {
            variableValues: OverridesObject,
          },
          customer: {
            number: customerPhoneNumber,
          },
          phoneNumberId: vapiPhoneId,
        };

        // Create Call (POST /assistantOverrides)
        console.log(
          "local_outboundAssistantOverrides:",
          local_outboundAssistantOverrides
        );
        console.log("assistantOverrides: ", assistantOverrides);

        const responseOverrides = await fetch(
          local_outboundAssistantOverrides,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assistantOverrides),
          }
        );

        const messageOverrides =
          "Overrides object for assistant created and sent to /outbound/assistantOverrides.";
        console.log(messageOverrides);
        return c.json({
          success: true,
          message: messageOverrides,
          result: responseOverrides,
        });
        break;

      // ====================================
      case "variableValues":
        //
        console.log("=================================");
        console.log("switch: variableValues");
        console.log("=================================");
        break;

      default:
        break;
    }

    console.log(
      ">> src/forms/index AssistantOverridesTemplate: \n",
      JSON.stringify(AssistantOverridesTemplate, null, 2)
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
interface AssistantOverridesTemplate {
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

//============================================================================
const createVapiSysPromptPlus = (demo: boolean) => {
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
const updateAssistantOverridesObject = async (
  AssistantOverridesTemplate: any,
  companyPhoneNumber: string,
  customerPhoneNumber: string
) => {
  // Reference systemPrompt from AssistantOverridesTemplate
  const assistant = AssistantOverridesTemplate.assistant;
  const systemPrompt = assistant.model.systemPrompt;

  const overwrites = updateOverridesTemplate(
    companyPhoneNumber,
    customerPhoneNumber
  );
  const systemPromptWithVariables = replaceLiterals(systemPrompt, overwrites);

  // Replace systemPrompt in assistant
  assistant.model.systemPrompt = systemPromptWithVariables;

  const assistantName = "default";
  const vapiPhoneNumberId =
    await assistantTable.findAssistantIDByNameAndPhoneNumber(
      companyPhoneNumber,
      assistantName
    );

  AssistantOverridesTemplate.phoneNumberId = vapiPhoneNumberId;
  AssistantOverridesTemplate.customer.number = customerPhoneNumber;
};

//============================================================================
interface Company {
  ID: string;
  name: string;
  phone: {
    number: string;
  };
}

interface Customer {
  ID: string;
  name: string;
  cell: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  name: string;
  size: string;
}

interface Order {
  orderDate: string;
  orderID: string;
  items: OrderItem[];
}

function updateOverridesTemplate(
  companyPhoneNumber: string,
  customerPhoneNumber: string
): Record<string, string> {
  // Update the CurrentDate in assistantWrapper
  const newDate = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const currentDate = newDate.toLocaleDateString("en-US", options);

  const COMPANY: Company = companyTable.getCompany(companyPhoneNumber);
  const CUSTOMER: Customer = customerTable.getCustomer(customerPhoneNumber);
  const LASTORDER_RAW = orderTable.getLastOrder(CUSTOMER.ID);
  const LASTORDER: Order = {
    ...LASTORDER_RAW,
    items: LASTORDER_RAW.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    })),
  };

  const lastOrderItems = LASTORDER.items
    .map((item) => `- ${item.quantity} units ${item.name}: ${item.size}`)
    .join("\n");

  const pendingOrderItems = LASTORDER.items
    .map((item) => `${item.id}, ${item.quantity}, ${item.name}`)
    .join("\n");

  const overwrites: Record<string, string> = {
    company: JSON.stringify(COMPANY),
    customer: JSON.stringify(CUSTOMER),
    last_order: JSON.stringify(LASTORDER),
    "last_order.order_date": LASTORDER.orderDate,
    "last_order.orderID": LASTORDER.orderID,
    "company.phone": COMPANY.phone.number,
    "company.name": COMPANY.name,
    "company.ID": COMPANY.ID,
    "customer.name": CUSTOMER.name,
    "customer.cell": CUSTOMER.cell,
    last_order_items: lastOrderItems,
    pending_order_items: pendingOrderItems,
    current_date: currentDate,
  };

  return overwrites;
}

//============================================================================
function replaceLiterals(
  template: string,
  values: Record<string, string>
): string {
  // Use a regular expression to find all occurrences of ${key}
  return template.replace(/\${(.*?)}/g, (_, key) => {
    // _ is the full match (e.g., ${key}), which we don't need
    // key is the captured group (e.g., key)
    // Trim the key and look up its value in the values object
    // If the key is not found, return an empty string
    return values[key.trim()] || "";
  });
}

export { app as formsRoute };
