// src/functionsDb/assistantTable/getAssistByPhoneNum.ts

export const getAssistByPhoneNum = (phoneNumber: string) => {
  return mockGetAssistByPhoneNum;
};

const mockGetAssistByPhoneNum = {
  companyName: "Acme Supplies",
  phoneNumbers: [
    {
      phoneNumber: "+16042106553",
      assistants: [
        {
          name: "default",
          assistantID: "97166f4e-61a5-4c6c-b15f-c6a295076707",
        },
        {
          name: "Bob",
          assistantID: "A002",
        },
      ],
    },
    {
      phoneNumber: "+0987654321",
      assistants: [
        {
          name: "Charlie",
          assistantID: "A003",
        },
        {
          name: "David",
          assistantID: "A004",
        },
      ],
    },
  ],
};

const data = {
  companyName: "Tech Solutions Inc.",
  phoneNumbers: [
    {
      phoneNumber: "+1234567890",
      assistants: [
        {
          name: "Alice",
          assistantID: "A001",
        },
        {
          name: "Bob",
          assistantID: "A002",
        },
      ],
    },
    {
      phoneNumber: "+0987654321",
      assistants: [
        {
          name: "Charlie",
          assistantID: "A003",
        },
        {
          name: "David",
          assistantID: "A004",
        },
      ],
    },
  ],
};

function findAssistantIDByName(data, assistantName) {
  for (const phoneNumber of data.phoneNumbers) {
    for (const assistant of phoneNumber.assistants) {
      if (assistant.name === assistantName) {
        return assistant.assistantID;
      }
    }
  }
  return null; // Return null if the assistant is not found
}

const assistantID = findAssistantIDByName(data, "Alice");
console.log(assistantID); // Output: A001
