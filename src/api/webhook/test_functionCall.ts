import { functionCallHandler } from './functionCall';
import { sendSms } from '../../functionsSms/sendSms';

// Define the payload
const payload = {
  artifact: {
    messages: [
      {
        role: 'tool_calls',
        toolCalls: [
          {
            id: "call_7yztiy7xxa7zTUmUA7fEWg8m",
            type: "function",
            function: {
              name: "sendSms",
              arguments: JSON.stringify({
                from: "+16042106553",
                to: "177-877-54146",
                message: "LAST ORDER\nOrder ID: 777\n    - 2 units Paper Towels: 24 rolls 2 ply\n    - 3 units Cleaner: 1 liter\nAnything you wish changed? Or, is it OK to reorder the same?"
              }),
            },
          },
        ],
      },
    ],
  },
};

// Define the functions object
const functions = {
  sendSms,
};

// Test the functionCallHandler
async function testFunctionCallHandler() {
  try {
    const result = await functionCallHandler(payload, functions);
    console.log('Test Result:', result);
  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testFunctionCallHandler();