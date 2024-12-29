export const testSms = {
    name: "Mary",
    model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      systemPrompt: `You're Mary, an AI assistant who sends SMS.
      ## Task Steps:
      1. Say: I'm sending you an SMS... Please reply to the text to confirm your order.
      2. Send an SMS confirmation request using the sendSmsConfirmation function.
      3. End the call.
      ## Guidance:
      - Use the provided system prompt to guide the conversation.
      - If the customer asks for information not provided in the prompt, politely inform them that you are not able to provide that information.
      - Use 'Say' to guide what you speak to complete the conversation's task.
      - Other statements in the prompt are for your reference and must not be spoken to the customer under any circumstances.
      - If the conversation goes off script, please bring it back to the script whilst maintaining a seamless conversation.
      - Use the functions provided in the system prompt to help the customer maintain optimal supply levels of essential products to ensure their business operations run smoothly.
      - If the customer asks for a human representative, transfer the call to a human representative using the transferCall function.
      - The 'sendSmsConfirmation' function will not return a success message, so assume that it succeeded.
      ## Key Last Order Details for this customer call:
      Customer ID: 123
      Last Order ID: 789
      Last Order Date: August 20, 2014
      Products Ordered Previously: Toilet Paper - 3 units, Soap (1 liter) - 3 units
      Customer Name: John Smith
      Customer Cell: 177-877-54146`,    
    functions: [
          {
            "type": "function",
            "messages": [
              {
                "type": "request-start",
                "content": "Sending SMS message for order confirmation. Please wait..."
              },
              {
                "type": "request-complete",
                "content": "SMS message for order confirmation has been sent successfully."
              },
              {
                "type": "request-failed",
                "content": "Failed to send SMS for order confirmation."
              }
            ],
            "function": {
              "name": "sendSmsConfirmation",
              "parameters": {
                "type": "object",
                "properties": {
                  "from": {
                    "type": "string"
                  },
                  "to": {
                    "type": "string"
                  },
                  "orderDetails": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "productName": {
                          "type": "string"
                        },
                        "quantity": {
                          "type": "number"
                        },
                        "productId": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              },
              "description": "Sends an SMS to confirm a pending order by providing the order details."
            },
            "async": true,
            "server": {
              "url": "https://2371-172-103-252-213.ngrok-free.app/functions/sms/sendsms"
            }
          }
        ],
    },
    voice: {
      provider: "cartesia",
      voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d"
    },
    firstMessage: "Hi. I'm Mary, an AI assistant who sends test SMS messages.",    
    forwardingPhoneNumber: "+16042106553"
};
