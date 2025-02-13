// src/functionsSms/sendSms.ts
// This file is used to send an SMS message to a user. It uses the Twilio API to send the message. The Twilio API is a third-party service that allows you to send SMS messages to users. 
// The sendSms function takes in a message, from, and to parameter and sends an SMS message to the user with the given phone number. 
// The test_sendSms function is used to test the sendSms function by sending a test message to a phone number.
import dotenv from 'dotenv';
dotenv.config();

// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendSms(message: string, from: string, to: string) {
  const sentMessage = await client.messages.create({
    body: message,
    from: from,
    to: to,
  });
  console.log(">>> src/functionsSms/sendSms.ts");
  console.log("sentMessage.body: ", sentMessage.body);
  console.log("<<< src/functionsSms/sendSms.ts");

  //Get toolCallId from parameter passed in payload

  // Test sentMessage, send different message for different results

  // const result = {
  //   "results": [
  //       {
  //           "toolCallId": "X",
  //           "result": "Y"
  //       }
  //   ]
  // }
  return sentMessage;
};

export async function test_sendSms(){
    const testMessage = {
        message: "This is the ship that made the Kessel Run in fourteen parsecs?",
        from: "+16042106553",
        to: "+17787754146",
      };
    const result = sendSms(testMessage.message, testMessage.from, testMessage.to);
    return result;
};

