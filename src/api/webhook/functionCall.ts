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

  const { functionCall } = payload;

  if (!functionCall) {
    throw new Error("Invalid Request.");
  }

  const { name, parameters } = functionCall;

  console.log(src/api/webhook/functionCall.ts);
  console.log(name, parameters);
  console.log(functions);
  console.log(functions[name]);

  if (Object.prototype.hasOwnProperty.call(functions, name)) {
    return await functions[name](parameters);
  } else {
    return;
  }
};
