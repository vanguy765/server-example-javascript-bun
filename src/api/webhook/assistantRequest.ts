import {
  AssistantRequestMessageResponse,
  AssistantRequestPayload,
} from "../../types/vapi.types";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Access the environment variables
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

export const assistantRequestHandler = async (
  payload?: AssistantRequestPayload
): Promise<AssistantRequestMessageResponse> => {
  /**!SECTION
   * Handle Business logic here.
   * You can fetch your database to see if there is an existing assistant associated with this call. If yes, return the assistant.
   * You can also fetch some params from your database to create the assistant and return it.
   * You can have various predefined static assistant here and return them based on the call details.
   */

  console.log("Processing ASSISTANT_REQUEST");
  console.log("payload", payload);

  const assistant = payload
    ? {
        timestamp: 1738302351129,
        type: "assistant-request",
        call: {
          id: "96b8b980-8508-4b7b-b3ee-de67a0550ad1",
          orgId: "620aaa3f-ceb7-4e4f-9f14-f59a6e9bd593",
          createdAt: "2025-01-31T05:45:51.002Z",
          updatedAt: "2025-01-31T05:45:51.002Z",
          type: "inboundPhoneCall",
          status: "ringing",
          phoneCallProvider: "twilio",
          phoneCallProviderId: "CAf0c04d1bed26b5c54bfaf2f8c545b3e7",
          phoneCallTransport: "pstn",
          phoneNumberId: "bbe53828-031f-4ff0-aa33-87ed885b71f4",
          assistantId: null,
          squadId: null,
          customer: {
            number: "+17787754146",
          },
        },
        phoneNumber: {
          id: "bbe53828-031f-4ff0-aa33-87ed885b71f4",
          orgId: "620aaa3f-ceb7-4e4f-9f14-f59a6e9bd593",
          assistantId: null,
          number: "+12367055080",
          createdAt: "2025-01-31T05:40:02.230Z",
          updatedAt: "2025-01-31T05:40:02.230Z",
          stripeSubscriptionId: null,
          twilioAccountSid: twilioAccountSid,
          twilioAuthToken: twilioAuthToken,
          stripeSubscriptionStatus: null,
          stripeSubscriptionCurrentPeriodStart: null,
          name: "Fernie BC",
          credentialId: null,
          serverUrl: null,
          serverUrlSecret: null,
          twilioOutgoingCallerId: null,
          sipUri: null,
          provider: "twilio",
          fallbackForwardingPhoneNumber: null,
          fallbackDestination: null,
          squadId: null,
          credentialIds: null,
          numberE164CheckEnabled: null,
          authentication: null,
          server: null,
          useClusterSip: null,
        },
        customer: {
          number: "+17787754146",
        },
      }
    : null;

  if (payload) {
    const assistantCallType = payload.call.type;
    console.log("=========================================================");
    console.log("assistantCallType", assistantCallType);
  }

  switch (assistant?.call?.type) {
    case "inboundPhoneCall":
      console.log("inboundPhoneCall");
      break;
    case "outboundPhoneCall":
      console.log("outboundPhoneCall");
      console.log("ERROR: OutboundPhoneCall not supported at this endpoint.");
      break;
    case "default":
      console.log("default");
      break;
  }

  if (assistant) return { assistant };

  throw new Error(`Invalid call details provided.`);
};

//   const assistant = payload.call
//     ? {
//         name: "Paula",
//         model: {
//           provider: "openai",
//           model: "gpt-3.5-turbo",
//           temperature: 0.7,
//           systemPrompt:
//             "You're Paula, an AI assistant who can help user draft beautiful emails to their clients based on the user requirements. Then Call sendEmail function to actually send the email.",
//           functions: [
//             {
//               name: "sendEmail",
//               description:
//                 "Send email to the given email address and with the given content.",
//               parameters: {
//                 type: "object",
//                 properties: {
//                   email: {
//                     type: "string",
//                     description: "Email to which we want to send the content.",
//                   },
//                   content: {
//                     type: "string",
//                     description: "Actual Content of the email to be sent.",
//                   },
//                 },
//                 required: ["email"],
//               },
//             },
//           ],
//         },
//         voice: {
//           provider: "11labs",
//           voiceId: "paula",
//         },
//         firstMessage: "Hi, I'm Paula, your personal email assistant.",
//       }
//     : null;
//   if (assistant) return { assistant };

//   throw new Error(`Invalid call details provided.`);
// };
