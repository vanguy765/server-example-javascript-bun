/**
 * Assistant Configuration Utilities
 *
 * This module handles the configuration and setup of voice assistants
 * including prompt building and tool configuration.
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Type definition for the agent object containing various data and configurations
 */
export interface AgentConfig {
  prompt?: string;
  tool?: any;
  xmlCustomer?: string;
  xmlCompany?: string;
  xmlProposedOrder?: string;
  xmlProductSpecials?: string;
  xmlFavoriteProducts?: string;
}

/**
 * Assistant tool for sending the order package via SMS
 */
export const tool_sendSmsOrderSpecialsFavorites = {
  function: {
    name: "sendSmsOrderSpecialsFavorites",
    description:
      "Sends an initial package of information (Proposed Order based on last order, Special Products, Favorite Products) to the customer's phone via SMS. The data is retrieved from the database using the callId.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  type: "function",
};

/**
 * Assistant tool for sending SMS order updates
 */
export const tool_sendSmsOrderUpdate = {
  function: {
    name: "sendSmsOrderUpdate",
    description:
      "Send an updated order summary via SMS to the customer after any order modifications",
    parameters: {
      type: "object",
      properties: {
        customerPhone: {
          type: "string",
          description:
            "Customer's phone number in E.164 format (e.g., +12175553456)",
        },
        customerName: {
          type: "string",
          description: "Customer's full name",
        },
        companyName: {
          type: "string",
          description: "Customer's company name",
        },
        orderItems: {
          type: "array",
          description: "Array of order line items",
          items: {
            type: "object",
            properties: {
              productName: {
                type: "string",
                description: "Name of the product",
              },
              size: {
                type: "string",
                description: "Product size/packaging",
              },
              quantity: {
                type: "integer",
                description: "Quantity ordered",
              },
              unitPrice: {
                type: "number",
                description: "Price per unit",
              },
              lineTotal: {
                type: "number",
                description: "Total for this line item (quantity × unitPrice)",
              },
            },
            required: [
              "productName",
              "size",
              "quantity",
              "unitPrice",
              "lineTotal",
            ],
          },
        },
        subtotal: {
          type: "number",
          description: "Order subtotal before taxes",
        },
        gst: {
          type: "number",
          description: "GST tax amount",
        },
        pst: {
          type: "number",
          description: "PST tax amount",
        },
        total: {
          type: "number",
          description: "Final total including all taxes",
        },
      },
      required: [
        "customerPhone",
        "customerName",
        "companyName",
        "orderItems",
        "subtotal",
        "gst",
        "pst",
        "total",
      ],
    },
  },
  type: "function",
};

/**
 * Builds a prompt from a template file by interpolating agent data
 *
 * @param templateFilePath - Path to the template file
 * @param agent - Agent configuration containing data to inject
 * @returns The built prompt with agent data inserted
 */
export function buildPromptFromFile(
  templateFilePath: string,
  agent: AgentConfig
): string {
  try {
    // Read the template file
    const promptTemplate = fs.readFileSync(templateFilePath, "utf8");

    // Replace template variables with actual values using a template literal function
    const interpolate = (template: string, variables: Record<string, any>) => {
      // Create a safe copy of the variables to prevent template literal execution issues
      const safeVariables: Record<string, any> = {};

      // Stringify and re-parse any complex objects to remove functions/methods
      for (const key in variables) {
        if (typeof variables[key] === "object" && variables[key] !== null) {
          safeVariables[key] = JSON.parse(JSON.stringify(variables[key]));
        } else {
          safeVariables[key] = variables[key];
        }
      }

      // Escape any backtick characters in the template
      const escapedTemplate = template.replace(/`/g, "\\`");

      // Return a function that executes the template with the safe variables
      try {
        return new Function(
          ...Object.keys(safeVariables),
          `return \`${escapedTemplate}\`;`
        )(...Object.values(safeVariables));
      } catch (error) {
        console.error("Error in template interpolation:", error);
        return template; // Return original template if interpolation fails
      }
    };

    // Build the prompt by replacing template variables
    const builtPrompt = interpolate(promptTemplate, {
      agent: agent,
    });

    return builtPrompt;
  } catch (error: any) {
    console.error(`Error building prompt from template: ${error.message}`);
    throw error;
  }
}

/**
 * Creates a voice assistant configuration object
 *
 * @param agentConfig - The agent configuration with prompt and tools
 * @returns A complete assistant configuration
 */
export function createAssistantConfig(agentConfig: AgentConfig) {
  return {
    transcriber: {
      provider: "deepgram",
      keywords: ["Bicky:1"],
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: agentConfig.prompt || "",
        },
      ],
      tools: agentConfig.tool ? [agentConfig.tool] : [],
    },
    voice: {
      provider: "openai",
      voiceId: "onyx",
    },
    voicemailMessage:
      "Hi, this is Jennifer from Bicky Realty. We were just calling to let you know...",
    firstMessage:
      "Hello, this is Alex, your AI sales assistant from Acme Cleaning Supply Inc.",
    endCallMessage: "Thanks for your time.",
    endCallFunctionEnabled: true,
    recordingEnabled: false,
    server: { url: "https://0746-24-86-56-54.ngrok-free.app/api/webhook" },
  };
}
