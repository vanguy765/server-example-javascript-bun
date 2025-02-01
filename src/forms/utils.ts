// demo/src/forms/utils.ts

import path from "path";
import updateSystemPrompt from "../assistants/playground/e_testAssistant";
import { assistantTable } from "../functionsDb/assistantTable";

interface AssistantOverridesTemplate {
  assistant?: any;
  phoneNumberId?: string;
  customer?: {
    number?: string;
  };
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

  // Assuming updateOverridesTemplate and replaceLiterals are also in utils.ts or accessible
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

// Placeholder functions - these need to be implemented or imported
const updateOverridesTemplate = (
  companyPhoneNumber: string,
  customerPhoneNumber: string
) => {
  return {}; // Replace with actual implementation or import
};

const replaceLiterals = (template: string, values: Record<string, string>) => {
  return template; // Replace with actual implementation or import
};

export { createVapiSysPromptPlus, updateAssistantOverridesObject };
