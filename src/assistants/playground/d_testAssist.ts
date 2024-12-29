export const testAssist = {
    name: "Mary",
    model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      systemPrompt: `You're Mary, an AI assistant who proactively assists customers in maintaining optimal supply levels of essential products to ensure their business operations run smoothly.

## Primary Role Objective:
You reach out to help customers avoid supply shortages and provide an effortless reorder experience of items on their last order strictly following the outline given in the Task Summary. Speak to the customer in a friendly and professional manner, and ensure you follow the script closely.

## Task Summary:
1. Ask: "Is it a convenient time to speak?" If unavailable, thank them and end the call politely. Continue only if they are available to talk.
2. Ask: "Would you like to repeat, review, or adjust your last order?"
  If they want to review or adjust their last order:
    Confirm the items, quantities, or any adjustments to create a refill order.
3. If they want to repeat their last order, or are satisfied with their refill order:
  Say: "Please hold a moment while I create your order." 
4. Create a refill order using the createOrder function.
5. Say: "Your order was created with status 'pending'. I'm sending you an SMS... Please reply to the text to confirm your order."
6. Send an SMS confirmation request using the sendSmsConfirmation function.
7. Ask: "Before you go... Please rate your experience with this call on a scale of 1 to 10, with 10 being the best."
8. Save the rating and any feedback provided by the customer using the saveFeedback function.
9. Say: "Thank you for your time. Goodbye."
10. End the call.

## Human Agent Transfer:
If the customer requests to speak with a human representative transfer the call immediately using the transferCall function.

## Guidance:
- Use the provided system prompt to guide the conversation.
- If the customer asks for information not provided in the prompt, politely inform them that you are not able to provide that information.
- Use 'Ask' or 'Say' to guide what you speak to complete the conversation's task.
- Other statements in the prompt are for your reference and must not be spoken to the customer under any circumstances.
- If the conversation goes off script, please bring it back to the script whilst maintaining a seamless conversation.
- Use the functions provided in the system prompt to help the customer maintain optimal supply levels of essential products to ensure their business operations run smoothly.
- If the customer asks for a human representative, transfer the call to a human representative using the transferCall function.
- The sendSmsConfirmation function will not return a success message, so assume that it succeeded.

## Key Last Order Details for this customer call:
Customer ID: 123
Last Order ID: 789
Last Order Date: August 20, 2014
Products Ordered Previously: Toilet Paper - 3 units, Soap (1 liter) - 3 units
Customer Name: John Smith
Customer Cell: 177-877-54146`,    
    functions: [
      {
        "type": "transferCall",
        "destinations": [
          {
            "type": "number",
            "number": "+17787754146",
            "transferPlan": {
              "mode": "warm-transfer-with-summary",
              "summaryPlan": {
                "enabled": true,
                "messages": [
                  {
                    "role": "system",
                    "content": "Please provide a summary of the call."
                  }
                ]
              }
            }
          }
        ],
        "messages": [
          {
            "type": "request-start",
            "content": "Just a moment while I connect you.",
            "conditions": [
              {
                "param": "destination",
                "operator": "eq",
                "value": "+17787754146"
              }
            ]
          }
        ]
      },
      {
        "type": "function",
        "messages": [
          {
            "type": "request-start",
            "content": "Creating an order with status 'pending'. Please wait..."
          },
          {
            "type": "request-complete",
            "content": "The order with status 'pending' has been created successfully."
          },
          {
            "type": "request-failed",
            "content": "Failed to create the order with status 'pending'."
          }
        ],
        "function": {
          "name": "createPendingOrder",
          "parameters": {
            "type": "object",
            "properties": {
              "customerId": {
                "type": "string"
              },
              "products": {
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
          "description": "Creates an order with status 'pending' using customer ID and product list."
        },
        "async": false,
        "server": {
          "url": "https://agentusai.com/api/functions/createOrder"
        }
      },
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
          "name": "sendSmsOrderConfirmation",
          "parameters": {
            "type": "object",
            "properties": {
              "sendingPhoneNumber": {
                "type": "string"
              },
              "receivingPhoneNumber": {
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
          "url": "https://agentusai.com/sms/sendSms"
        }
      },
      {
        "type": "function",
        "messages": [
          {
            "type": "request-start",
            "content": "Finalizing the draft order. Please wait..."
          },
          {
            "type": "request-complete",
            "content": "The draft order has been confirmed and finalized."
          },
          {
            "type": "request-failed",
            "content": "Failed to confirm and finalize the draft order."
          }
        ],
        "function": {
          "name": "createNewOrder",
          "parameters": {
            "type": "object",
            "properties": {
              "phoneNumber": {
                "type": "string"
              }
            }
          },
          "description": "Confirms the draft order and marks it as a finalized order."
        },
        "async": false,
        "server": {
          "url": "https://agentusai.com/createNewOrder"
        }
      }
    ]
  },
voice: {
  provider: "cartesia",
  voiceId: "248be419-c632-4f23-adf1-5324ed7dbf1d"
},
firstMessage: "Hi. I'm Mary, an AI assistant from Aaron Supplies calling to check the levels of supplies from your last order.",    
forwardingPhoneNumber: "+16042106553",
serverMessages: [
  "function-call",
  "tool-calls"
]
};


  // Contact an existing customer to inquire if they would like to repeat or adjust their last order. Confirm the items, quantities, or any adjustments to create a refill order. Use createOrder function to place the refill order. Use sendSmsConfirmation function to confirm the refill order via sms.

  // Be silent while you create a refill order using the createOrder function and wait for the reply.