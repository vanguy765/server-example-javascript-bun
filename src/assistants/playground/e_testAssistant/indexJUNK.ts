// src/assistants/playground/e_testAssistant/indexJUNK.ts
import { readFileSync, writeFileSync } from 'fs';
import _ from 'lodash';
import { inspect } from 'util';
import { join } from 'path'; // Import join from path module

function getPromptFromMdFile(filePath: string) {
    try {
        // Read file synchronously
        const systemPrompt = readFileSync(filePath, 'utf8')
            .replace(/[\r\n]+/g, '\n')  // normalize line endings
            .replace(/"/g, '\\"')       // escape double quotes
            .trim();  // trim whitespace
  
        return systemPrompt;
    } catch (error) {
        console.error('Error reading system prompt file:', error);
        return null;
    }
}

// console.log('__dirname:', __dirname);

const pathAssist = JSON.parse(readFileSync(join(__dirname, './e_testAssist.json'), 'utf-8'));
const pathPrompt = join(__dirname, './e_testPrompt3.md');
const pathFunctions = join(__dirname, './e_testFunctions.json');
const pathFirstMessage = join(__dirname, './e_testFirstMessage.md');

// Read the content of the files
const prompt = getPromptFromMdFile(pathPrompt);
// const prompt = readFileSync(pathPrompt, 'utf-8');
const functions = JSON.parse(readFileSync(pathFunctions, 'utf-8'));
const firstMessage = getPromptFromMdFile(pathFirstMessage);
// const firstMessage = readFileSync(pathFirstMessage, 'utf-8');

// console.log('# # # # # # # # # # # # # # # #');
// console.log('ENTRY src/assistants/playground/e_testAssistant/index.ts');
// // console.log('prompt:', pathAssist);
// console.log('pathAssist:', inspect(pathAssist, { depth: null, colors: true }));
// // console.log('prompt:', prompt);
// console.log('prompt:', inspect(prompt, { depth: null, colors: true }));
// // console.log('pathFunctions:', pathFunctions);
// console.log('functions:', inspect(functions, { depth: null, colors: true }));
// // console.log('firstMessage:', firstMessage);
// console.log('firstMessage:', inspect(firstMessage, { depth: null, colors: true }));

// Update updatedAssistData with content;
const updatedAssistData = _.cloneDeep(pathAssist);
(updatedAssistData.assistant.model as { functions: typeof functions }).functions = _.cloneDeep(functions.functions);
// (updatedAssistData.assistant as unknown as { model: { systemPrompt: string } }).model.systemPrompt = prompt;
(updatedAssistData.assistant.model as unknown as { systemPrompt: string }).systemPrompt = prompt ?? '';
(updatedAssistData.assistant as { firstMessage: string }).firstMessage = firstMessage ?? '';

// console.log('=================================');
// console.log('updatedAssistData:', inspect(updatedAssistData, { depth: null, colors: true }));

// console.log('=================================');
// console.log('pathAssist:', inspect(pathAssist, { depth: null, colors: true }));

export default updatedAssistData;