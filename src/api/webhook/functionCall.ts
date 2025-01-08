// src/api/webhook/functionCall.ts

import functionsDefault from "../../functions";
import functionsSms from "../../functionsSms";
import { FunctionCallPayload } from "../../types/vapi.types";



// import functionsDb from "../../functionsDb";
// const defaultFunctions = {
//   ...functionsDefault,
//   ...functionsDb,
//   ...functionsSms,
// };
const defaultFunctions = {
  ...functionsDefault,
  ...functionsSms,
};

export const functionCallHandler = async (
  payload: FunctionCallPayload,
  functions: Record<string, Function> = defaultFunctions
) => {
  /**
   * Handle Business logic here.
   * You can handle function calls here. The payload will have function name and parameters.
   * You can trigger the appropriate function based your requirements and configurations.
   * You can also have a set of validators along with each functions which can be used to first validate the parameters and then call the functions.
   * Here Assumption is that the function are handling the fallback cases as well. They should return the appropriate response in case of any error.
   */


  
// console.log("src/api/webhook/functionCall.ts", payload);


// // Extract functionCall
// const functionCall = payload.functionCall;
// console.log("Function Call:", functionCall);

// // Extract tool_calls from the messages array
// interface Message {
//   role: string;
//   toolCalls?: any; // Replace 'any' with the appropriate type if known
// }

// interface Artifact {
//   messages: Message[];
// }

// interface FunctionCallPayload {
//   functionCall: {
//     name: string;
//     parameters: any; // Replace 'any' with the appropriate type if known
//   };
//   artifact: Artifact;
// }
const toolCalls = payload.artifact.messages
.find((msg: Message) => msg.role === 'tool_calls')?.toolCalls;

if (!toolCalls) {
throw new Error("Invalid Request.");
}

const toolCallCurrent = toolCalls[0];
const toolCallId = toolCallCurrent.id;
const name = toolCallCurrent.function.name;
const parameters = JSON.parse(toolCallCurrent.function.arguments);



console.log("");
console.log("ENTER src/api/webhook/functionCall.ts");
console.log("parameters", parameters);
console.log("Tool Calls:", toolCalls);
console.log("name", name);
console.log("toolCallId", toolCallId);
console.log("functions", functions);
console.log("functions[name]", functions[name]);

if (Object.prototype.hasOwnProperty.call(functions, name)) {
const resultSendSms = await functions[name](parameters.message, parameters.from, parameters.to);
console.log("resultSendSms", resultSendSms);
console.log("EXIT src/api/webhook/functionCall.ts");

return {
  "results": [
      {
          "toolCallId": toolCallId,
          "result": resultSendSms
      }
  ]
};
} else {
return;
}
};