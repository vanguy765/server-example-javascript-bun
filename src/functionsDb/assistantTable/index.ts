// src/functionsDb/assistantTable/index.ts

import mockData from "./mockData.json";
import jmespath from "jmespath";

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
  const query = `phoneNumbers[?phoneNumber == '${phoneNumber}'].assistants[] 
                | [?name == '${assistantName}'].assistantID | [0] `;
  const result = jmespath.search(data, query);
  return result || null;
}

function findAssistantIDByName(
  assistantName: string,
  data: Data = mockData
): string | null {
  const query = `phoneNumbers[].assistants[?name == '${assistantName}'].assistantID | [0]`;
  const result = jmespath.search(data, query);
  return result || null;
}

function findVapiPhoneIDByPhoneNumber(
  phoneNumber: string,
  data: Data = mockData
): string | null {
  const query = `phoneNumbers[?phoneNumber == '${phoneNumber}'].vapiPhoneID | [0]`;
  const result = jmespath.search(data, query);
  return result || null;
}
export const assistantTable = {
  findAssistantIDByName,
  findAssistantIDByNameAndPhoneNumber,
  findVapiPhoneIDByPhoneNumber,
};
