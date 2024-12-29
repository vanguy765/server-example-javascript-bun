import { readFileSync, writeFileSync } from 'fs';
import _ from 'lodash';
import { inspect } from 'util';
import { join } from 'path'; // Import join from path module

// import e_testAssist from './e_testAssist.json';
// import e_testFunctions from './e_testFunctions.json';
// import e_testFirstMessage from './e_testFirstMessage.md';

import { exit } from "process";

console.log('__dirname:', __dirname);
const pathAssist = JSON.parse(readFileSync(join(__dirname, './e_testAssist.json'), 'utf-8'));
const pathPrompt = join(__dirname, './e_testPrompt.md');
const pathFunctions = join(__dirname, './e_testFunctions.json');
const pathFirstMessage = join(__dirname, './e_testFirstMessage.md');

// Read the content of the files
const prompt = readFileSync(pathPrompt, 'utf-8');
const functions = JSON.parse(readFileSync(pathFunctions, 'utf-8'));
const firstMessage = readFileSync(pathFirstMessage, 'utf-8');

console.log('# # # # # # # # # # # # # # # #');
console.log('ENTRY src/assistants/playground/e_testAssistant/index.ts');
console.log('prompt:', pathAssist);
console.log('prompt:', prompt);
console.log('pathFunctions:', pathFunctions);
console.log('firstMessage:', firstMessage);

// Update updatedAssistData with content;
const updatedAssistData = _.cloneDeep(pathAssist);
(updatedAssistData.assistant.model as { functions: typeof functions }).functions = _.cloneDeep(functions.functions);
// (updatedAssistData.assistant as unknown as { model: { systemPrompt: string } }).model.systemPrompt = prompt;
(updatedAssistData.assistant.model as unknown as { systemPrompt: string  }).systemPrompt = prompt;
(updatedAssistData.assistant as { firstMessage: string }).firstMessage = firstMessage;


console.log('=================================');
console.log('updatedAssistData:', inspect(updatedAssistData, { depth: null, colors: true }));

// console.log('=================================');
// console.log('pathAssist:', inspect(pathAssist, { depth: null, colors: true }));