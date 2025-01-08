import { readFileSync } from 'fs';
import path from 'path';

interface UpdateSystemPromptParams {
    pathSystemPromptFile: string;
    pathFirstMessageFile: string;
    pathGuidelinesFile: string;
    assistantWrapperFile: string;
    pathFunctionsFile: string;
}

function updateSystemPrompt({
    pathSystemPromptFile,
    pathFirstMessageFile,
    pathGuidelinesFile,
    assistantWrapperFile,
    pathFunctionsFile
}: UpdateSystemPromptParams) {

// console.log("updateSystemPrompt pathSystemPromptFile: ", pathSystemPromptFile);
// console.log("updateSystemPrompt pathFirstMessageFile: ", pathFirstMessageFile);
// console.log("updateSystemPrompt pathGuidelinesFile: ", pathGuidelinesFile);
// console.log("updateSystemPrompt assistantWrapperFile: ", assistantWrapperFile);
// console.log("updateSystemPrompt pathFunctionsFile: ", pathFunctionsFile);




    try {
        // systemPrompt - Read the Markdown file
        const systemPrompt = readFileSync(pathSystemPromptFile, 'utf8')
            .replace(/[\r\n]+/g, '\n')  // normalize line endings
            .trim();  // trim whitespace

        // firstMessage - Read the Markdown file
        const firstMessage = readFileSync(pathFirstMessageFile, 'utf8')
            .replace(/[\r\n]+/g, '\n')  // normalize line endings
            .trim();  // trim whitespace

        // guidelines - Read the Markdown file
        const guidelines = readFileSync(pathGuidelinesFile, 'utf8')
            .replace(/[\r\n]+/g, '\n')  // normalize line endings
            .trim();  // trim whitespace

        // assistantWrapper - Read the assistant template JSON file
        const assistantWrapper = JSON.parse(readFileSync(assistantWrapperFile, 'utf8'));

        // functions - Read the functions JSON file
        const functions = JSON.parse(readFileSync(pathFunctionsFile, 'utf8'));

        // Insert the functions
        assistantWrapper.assistant.model.functions = functions.functions;
        // Insert the firstMessage
        assistantWrapper.assistant.model.systemPrompt = systemPrompt;
        // Insert the systemPrompt
        assistantWrapper.assistant.firstMessage = firstMessage;

        // Print the updated assistantWrapper object
        // console.log("updateSystemPrompt assistant: ", JSON.stringify(assistantWrapper, null, 2));
        return assistantWrapper;

    } catch (error) {
        console.error('Error updating system prompt:', error);
    }
}

export default updateSystemPrompt;

//=============================================================================
if (require.main === module) {
    const testPath = "";
    const testParams = {
        pathSystemPromptFile: 'e_testPrompt3.md',
        assistantWrapperFile: 'e_testAssist.json',
        pathFirstMessageFile: 'e_testFirstMessage.md',
        pathGuidelinesFile: 'e_testGuidelines.md',
        pathFunctionsFile: 'e_testFunctions.json'
    };
    const basePath = path.resolve(__dirname, testPath);
    const pathSystemPromptFile = path.join(basePath, testParams.pathSystemPromptFile);
    const pathFirstMessageFile = path.join(basePath, testParams.pathFirstMessageFile);
    const pathGuidelinesFile = path.join(basePath, testParams.pathGuidelinesFile);
    const assistantWrapperFile = path.join(basePath, testParams.assistantWrapperFile);
    const pathFunctionsFile = path.join(basePath, testParams.pathFunctionsFile);

    const result = updateSystemPrompt({
            pathSystemPromptFile: pathSystemPromptFile,
            pathFirstMessageFile: pathFirstMessageFile,
            pathGuidelinesFile: pathGuidelinesFile,
            assistantWrapperFile: assistantWrapperFile,
            pathFunctionsFile: pathFunctionsFile
        });

    console.log(JSON.stringify(result, null, 2));
}