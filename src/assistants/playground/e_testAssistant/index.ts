import { readFileSync } from 'fs';
import { join } from 'path';

function updateSystemPrompt(
    pathAssistFile: string, 
    pathPromptFile: string, 
    pathFunctionsFile: string,
    pathFirstMessageFile: string,
    pathGuidelinesFile: string,
    pathLastOrderFile: string
    ) {

    try {
        
        // Read the Markdown file
        const systemPrompt = readFileSync(pathPromptFile, 'utf8')
            .replace(/[\r\n]+/g, '\n')  // normalize line endings
            .trim();  // trim whitespace

        // Read the Markdown file
        const firstMessage = readFileSync(pathFirstMessageFile, 'utf8')
        .replace(/[\r\n]+/g, '\n')  // normalize line endings
        .trim();  // trim whitespace
      
        // Read the Markdown file
        const guidelines = readFileSync(pathGuidelinesFile, 'utf8')
        .replace(/[\r\n]+/g, '\n')  // normalize line endings
        .trim();  // trim whitespace

        // Read the assistant template JSON file
        const pathAssist = JSON.parse(readFileSync(pathAssistFile, 'utf8'));
        // Read the functions JSON file
        const functions = JSON.parse(readFileSync(pathFunctionsFile, 'utf8'));

        // Read the lastOrder JSON file
        console.log('pathLastOrderFile:', pathLastOrderFile); // Log the content for debugging
        const lastOrderContent = readFileSync(pathLastOrderFile, 'utf8');
        console.log('lastOrderContent:', lastOrderContent); // Log the content for debugging
        const lastOrder = JSON.parse(lastOrderContent);

        
        // Update the systemPrompt in pathAssist
        pathAssist.assistant.model.systemPrompt = systemPrompt;
        // Insert the functions into pathAssist.assistant.model.functions
        pathAssist.assistant.model.functions = functions.functions;        
        // Update the firstMessage in pathAssist
        pathAssist.assistant.firstMessage = firstMessage;
        
        // Print the updated pathAssist object
        // console.log("updateSystemPrompt assistant: ", JSON.stringify(pathAssist, null, 2));
        return pathAssist;

    } catch (error) {
        console.error('Error updating system prompt:', error);
    }
}
export default updateSystemPrompt;