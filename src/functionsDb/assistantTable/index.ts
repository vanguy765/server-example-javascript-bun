// src/functionsDb/assistantTable/index.ts

import mockData from "./mockData.json";
import { getAssistByPhoneNum } from "./getAssistByPhoneNum";

interface Assistant {
  name: string;
  assistantID: string;
}

interface PhoneNumber {
  phoneNumber: string;
  assistants: Assistant[];
}

interface Data {
  phoneNumbers: PhoneNumber[];
}

function findAssistantIDByNameAndPhoneNumber(
  assistantName: string,
  phoneNumber: string,
  data: Data = mockData
): string | null {
  for (const phone of data.phoneNumbers) {
    if (phone.phoneNumber === phoneNumber) {
      for (const assistant of phone.assistants) {
        if (assistant.name === assistantName) {
          return assistant.assistantID;
        }
      }
    }
  }
  return null; // Return null if the assistant is not found
}

function findAssistantIDByName(
  assistantName: string,
  data: Data = mockData
): string | null {
  for (const phoneNumber of data.phoneNumbers) {
    for (const assistant of phoneNumber.assistants) {
      if (assistant.name === assistantName) {
        return assistant.assistantID;
      }
    }
  }
  return null; // Return null if the assistant is not found
}

// const assistantID = findAssistantIDByName(data, "Alice");
// console.log(assistantID); // Output: A001

// // JMESPath query for findAssistantIDByNameAndPhoneNumber
// const queryByNameAndPhone =
//   "phoneNumbers[?phoneNumber == '+1234567890'].assistants[?name == 'Alice'].assistantID | [0]";
// const assistantIDByNameAndPhone = jmespath.search(data, queryByNameAndPhone);
// console.log(assistantIDByNameAndPhone); // Output: A001

// // JMESPath query for findAssistantIDByName
// const queryByName =
//   "phoneNumbers[].assistants[?name == 'Alice'].assistantID | [0]";
// const assistantIDByName = jmespath.search(data, queryByName);
// console.log(assistantIDByName); // Output: A001

export const assistantTable = {
  findAssistantIDByName,
  findAssistantIDByNameAndPhoneNumber,
};
