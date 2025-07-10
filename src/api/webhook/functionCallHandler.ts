import defaultFunctions from "../../functions";
import {
  FunctionCallPayload,
  ToolCallsPayload,
  VapiWebhookEnum,
} from "../../types/vapi.types";

export const functionCallHandler = async (
  payload: FunctionCallPayload | ToolCallsPayload,
  functions: Record<string, Function> = defaultFunctions
) => {
  /**
   * Handle Business logic here.
   * You can handle function calls here. The payload will have function name and parameters.
   * You can trigger the appropriate function based your requirements and configurations.
   * You can also have a set of validators along with each functions which can be used to first validate the parameters and then call the functions.
   * Here Assumption is that the function are handling the fallback cases as well. They should return the appropriate response in case of any error.
   */
  console.log(
    ":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::"
  );
  console.log("Files functionCallHandler.ts:");
  console.log("Function Call Payload Call id:", payload.call.id);
  //===================================================================================
  // process.exit(1); // For debugging purposes, remove this in production
  //===================================================================================

  // Extract function name and parameters based on payload type
  let name: string;
  let parameters: any;

  if (
    "type" in payload &&
    payload.type === VapiWebhookEnum.TOOL_CALLS &&
    "toolCalls" in payload &&
    Array.isArray(payload.toolCalls) &&
    payload.toolCalls.length > 0
  ) {
    // Handle tool-calls format
    const toolCall = payload.toolCalls[0];
    name = toolCall.function.name;
    try {
      // Check if arguments is already an object (not a string)
      if (
        typeof toolCall.function.arguments === "object" &&
        toolCall.function.arguments !== null
      ) {
        parameters = toolCall.function.arguments;
      } else if (typeof toolCall.function.arguments === "string") {
        // Try to parse the string as JSON
        parameters = JSON.parse(toolCall.function.arguments || "{}");
      } else {
        // Default to empty object if arguments is undefined or another type
        parameters = {};
      }
    } catch (e) {
      parameters = {};
      console.error("Error parsing arguments:", e);
    }

    console.log("1. Extracted from tool-calls:", { name, parameters });
  } else if (
    "type" in payload &&
    payload.type === VapiWebhookEnum.FUNCTION_CALL &&
    "functionCall" in payload &&
    payload.functionCall
  ) {
    // Handle function-call format
    name = payload.functionCall.name;
    parameters = payload.functionCall.parameters || {};
    console.log("2. Extracted from function-call:", { name, parameters });
  } else {
    throw new Error("Invalid Request: No function call found in payload");
  }

  console.log("4 Function Call name:", name);
  // Now we have name and parameters, regardless of which format was used
  // Call the appropriate function from our functions map
  if (name && Object.prototype.hasOwnProperty.call(functions, name)) {
    try {
      // Pass both parameters and the full payload to the function
      return await functions[name](parameters, payload);
    } catch (error) {
      console.error(`Error executing function ${name}:`, error);
      return {
        success: false,
        error: `Error executing ${name}: ${
          error instanceof Error ? error.message : String(error)
        }`,
        message:
          "I encountered an error while processing your request. Please try again.",
      };
    }
  } else {
    console.warn(`Unknown function call: ${name}`);
    return {
      success: false,
      error: `Function '${name}' is not recognized`,
      message: "I'm sorry, I don't know how to handle that request.",
    };
  }
};
