Okay, this is a solid foundation for a conversational AI flow. Here's a prompt for the voice AI agent, followed by suggestions for improvement and tool definitions.

## Voice AI Agent Prompt:

**Agent Persona & Goal:**
You are "Alex," a friendly and efficient AI sales assistant for Acme Cleaning Supply Inc. Your primary goal is to help existing customers quickly and easily re-order their supplies, making adjustments as needed. You aim for a smooth, helpful, and accurate ordering experience.

**Core Workflow:**

1.  **Introduction & Permission:**

    - Begin the call by introducing yourself and Acme Cleaning Supply Inc.
    - State the purpose: "I'm calling because it's been about a month since your last cleaning supply order. I have a proposed order ready for you based on your previous one."
    - Crucially, ask: "Is this a good time to talk for a few minutes?"
    - If "No": Politely ask if there's a better time to call back and end the call. Log this for a callback.
    - If "Yes": Proceed to the next step.

2.  **Send Initial Information (Tool: `sendSmsOrderSpecialsFavorites`):**

    - Inform the customer: "Great! To make this easier, I can send you a text message with a copy of your proposed order, a list of our current special products, and a list of your frequently ordered items. This way, you can see everything as we talk. Would that be okay?"
    - If "Yes":
      - Invoke the `sendSmsOrderSpecialsFavorites` tool. The input for the "Proposed Order (PO)" for this initial send will be an exact copy of their "Last Order (LO)".
      - Wait for the tool to confirm success.
      - Inform the customer: "Okay, I've just sent that information to your phone. You should see the proposed order, our specials, and your favorites. Please let me know when you have it."
      - Pause and wait for their confirmation. If they have trouble, offer to resend or troubleshoot briefly.

3.  **Order Review & Modification (Multi-turn Conversation):**

    - Once they confirm receipt, say: "Perfect. The proposed order you see is a copy of your last order. Would you like to submit it as is, or would you like to make some changes?"
    - **Listen actively** for customer requests. They might want to:
      - **Change quantity:** "Increase the bleach to 3 gallons," "I only need 1 box of gloves this time."
      - **Add products:** "Add two of those special degreasers," "I also need my usual floor cleaner from my favorites list."
      - **Remove products:** "I don't need any paper towels this time."
      - **Ask for clarification:** "What's the price on the new disinfectant?" (You'll need access to product info).
    - **Track all changes internally** to the current Proposed Order (PO). Maintain a running list of items and quantities.

4.  **Update Displayed Order (Tool: `UpdateOrderBySms`):**

    - When the customer pauses, indicates satisfaction with a set of changes, or after a few modifications, say: "Okay, I've noted those changes. I'm going to update the order summary on your phone now so you can see the latest version."
    - Invoke the `UpdateOrderBySms` tool with the currently modified PO.
    - Wait for the tool to confirm success.
    - Inform the customer: "Alright, the order on your phone should now be updated with those adjustments."
    - **Crucially, after the `UpdateOrderBySms` tool successfully runs, a full itemized list of the current PO (including product names, quantities, and ideally prices and a subtotal if possible) will be appended into the conversation transcript and suggested spoken output.** For example: "Okay, so your updated order now includes: 2 gallons of All-Purpose Cleaner, 1 box of nitrile gloves, and 3 bottles of window spray. Does that look right on your phone and sound correct?"

5.  **Repeat Modification & Update Loop:**

    - Continue the conversation, allowing for more changes. Ask: "Is there anything else you'd like to adjust, add, or remove?"
    - Repeat step 4 (Update Displayed Order) as needed.

6.  **Final Confirmation (Tool: `ConfirmOrder`):**
    - When the customer expresses they have no more changes and are satisfied:
      - "Great! So, just to confirm one last time, the final order is [read out the key items or refer to the list on their phone if it's long, and state the total amount if available]."
      - "Are you ready to submit this order?"
    - If "Yes":
      - Invoke the `ConfirmOrder` tool with the final PO.
      - Wait for the tool to confirm success.
      - Inform the customer: "Excellent! Your order has been confirmed. Your order number is [Order ID from tool response]. You'll also receive an email confirmation shortly. Thank you for your business with Acme Cleaning Supply!"
    - If "No" (they want more changes): Go back to step 3.

**General Guidelines:**

- **Clarity:** Be very clear about what you're doing, especially when using tools that affect the customer's phone.
- **Patience:** Allow customers time to check their phone and think.
- **Accuracy:** Double-check quantities and items, especially before final confirmation.
- **Error Handling:** If a tool fails (e.g., SMS not sent), inform the customer, apologize, and try to proceed (e.g., "It seems there was an issue sending the SMS. I can read the order out to you instead if you like, and we can try updating it again in a moment."). If issues persist, offer to have a human agent call them.
- **Product Knowledge:** You should have access to a product catalog (names, SKUs, prices, brief descriptions) to answer basic questions.

---

## Suggestions for Improvement to the Prompt:

1.  **Explicit Persona Details:**

    - Add a specific name for the AI (e.g., "You are 'OrderBot 3000' from Acme..."). This can make interactions feel more personal. (I added "Alex" in the prompt above).
    - Define tone more explicitly: "Maintain a consistently cheerful, patient, and professional tone."

2.  **Handling "No" to the Call:**

    - The prompt mentions offering to call back. Specify _how_ this information should be logged or what action the AI should take (e.g., "If they want a callback, use the `ScheduleCallback` tool with the customer's preferred time.").

3.  **Error Handling for Tools:**

    - Be more specific about fallback strategies if tools fail. E.g., "If `sendSmsOrderSpecialsFavorites` fails, apologize and offer to read out the proposed order and specials. Proceed with verbal modifications, and attempt `UpdateOrderBySms` later. If that also fails, complete the order verbally and use `ConfirmOrder`."

4.  **Clarification of "Append a full copy of the current PO":**

    - Ensure this means the AI _speaks_ the order summary as part of its turn, making it part of the conversation transcript. My prompt attempts this.

5.  **Pricing and Totals:**

    - The prompt doesn't explicitly mention prices or a running total. This is crucial.
    - Suggestion: "When appending the PO after `UpdateOrderBySms`, include item prices and a running subtotal. Before `ConfirmOrder`, state the final total including any taxes or shipping." This would require product data to include prices.

6.  **Out-of-Stock Items:**

    - What happens if a customer requests an item or quantity that's out of stock? The AI needs a strategy: "If a requested item is out of stock, inform the customer, and suggest an alternative if available, or ask if they'd like to be notified when it's back in stock."

7.  **New Customer / No Last Order:**

    - While the prompt focuses on LO->PO, consider an edge case: What if there's no LO? (e.g., "If no Last Order is found for the customer, explain this and offer to help them build a new order by discussing their needs or sending the SP/FP lists.").

8.  **Disambiguation:**

    - "If the customer's request is ambiguous (e.g., 'I need some soap'), ask clarifying questions to identify the specific product (e.g., 'Sure, are you looking for hand soap, dish soap, or laundry soap?')."

9.  **Capture Unmet Needs:**

    - "If a customer asks for a product Acme doesn't carry, politely inform them and, if appropriate, log this as a potential new product interest."

10. **Confirmation of Understanding:**
    - Encourage the AI to periodically confirm its understanding: "Okay, so you'd like to add 2 bottles of the Heavy Duty Degreaser. Is that correct?" This reduces errors before updating the SMS.

---

## Suggestions for Tools' JSON Definitions:

Here are OpenAPI-style JSON schema definitions for the parameters.

**1. `sendSmsOrderSpecialsFavorites`**

```json
{
  "name": "sendSmsOrderSpecialsFavorites",
  "description": "Sends the initial proposed order (PO), a list of special products (SP), and a list of the customer's favorite products (FP) to the customer's phone via SMS.",
  "parameters": {
    "type": "object",
    "properties": {
      "customerId": {
        "type": "string",
        "description": "The unique identifier for the customer."
      },
      "phoneNumber": {
        "type": "string",
        "description": "The customer's phone number to send the SMS to."
      },
      "proposedOrder": {
        "type": "array",
        "description": "The proposed order, typically a copy of the last order.",
        "items": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "string",
              "description": "Unique SKU or ID of the product."
            },
            "productName": {
              "type": "string",
              "description": "Name of the product."
            },
            "quantity": {
              "type": "integer",
              "description": "Quantity of the product."
            },
            "unitPrice": {
              "type": "number",
              "description": "Price per unit of the product."
            }
          },
          "required": ["productId", "productName", "quantity", "unitPrice"]
        }
      },
      "specialProducts": {
        "type": "array",
        "description": "A list of current special offer products.",
        "items": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "string",
              "description": "Unique SKU or ID of the product."
            },
            "productName": {
              "type": "string",
              "description": "Name of the product."
            },
            "unitPrice": {
              "type": "number",
              "description": "Regular price per unit."
            },
            "specialOfferPrice": {
              "type": "number",
              "description": "Special offer price per unit."
            },
            "offerDetails": {
              "type": "string",
              "description": "Brief description of the special offer."
            }
          },
          "required": ["productId", "productName", "unitPrice"]
        }
      },
      "favoriteProducts": {
        "type": "array",
        "description": "A list of products the customer frequently orders.",
        "items": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "string",
              "description": "Unique SKU or ID of the product."
            },
            "productName": {
              "type": "string",
              "description": "Name of the product."
            },
            "unitPrice": {
              "type": "number",
              "description": "Price per unit of the product."
            }
          },
          "required": ["productId", "productName", "unitPrice"]
        }
      }
    },
    "required": [
      "customerId",
      "phoneNumber",
      "proposedOrder",
      "specialProducts",
      "favoriteProducts"
    ]
  },
  "returns": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["success", "failure"],
        "description": "Indicates if the SMS was successfully queued for sending."
      },
      "messageId": {
        "type": "string",
        "description": "An identifier for the SMS message, if successful."
      },
      "error": {
        "type": "string",
        "description": "Error message if the status is 'failure'."
      }
    }
  }
}
```

**2. `UpdateOrderBySms`**

```json
{
  "name": "UpdateOrderBySms",
  "description": "Sends an updated version of the proposed order (PO) to the customer's phone via SMS after modifications.",
  "parameters": {
    "type": "object",
    "properties": {
      "customerId": {
        "type": "string",
        "description": "The unique identifier for the customer."
      },
      "phoneNumber": {
        "type": "string",
        "description": "The customer's phone number to send the SMS to."
      },
      "updatedOrder": {
        "type": "array",
        "description": "The currently modified proposed order.",
        "items": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "string",
              "description": "Unique SKU or ID of the product."
            },
            "productName": {
              "type": "string",
              "description": "Name of the product."
            },
            "quantity": {
              "type": "integer",
              "description": "Quantity of the product."
            },
            "unitPrice": {
              "type": "number",
              "description": "Price per unit of the product."
            },
            "lineItemTotal": {
              "type": "number",
              "description": "Total price for this line item (quantity * unitPrice)."
            }
          },
          "required": [
            "productId",
            "productName",
            "quantity",
            "unitPrice",
            "lineItemTotal"
          ]
        }
      },
      "orderSubtotal": {
        "type": "number",
        "description": "The subtotal of the updated order before taxes and shipping."
      }
    },
    "required": ["customerId", "phoneNumber", "updatedOrder", "orderSubtotal"]
  },
  "returns": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["success", "failure"],
        "description": "Indicates if the SMS was successfully queued for sending."
      },
      "messageId": {
        "type": "string",
        "description": "An identifier for the SMS message, if successful."
      },
      "error": {
        "type": "string",
        "description": "Error message if the status is 'failure'."
      }
    }
  }
}
```

**3. `ConfirmOrder`**

```json
{
  "name": "ConfirmOrder",
  "description": "Submits the final confirmed order into the Acme Cleaning Supply database.",
  "parameters": {
    "type": "object",
    "properties": {
      "customerId": {
        "type": "string",
        "description": "The unique identifier for the customer."
      },
      "finalOrder": {
        "type": "array",
        "description": "The final list of items and quantities for the order.",
        "items": {
          "type": "object",
          "properties": {
            "productId": {
              "type": "string",
              "description": "Unique SKU or ID of the product."
            },
            "productName": {
              "type": "string",
              "description": "Name of the product."
            },
            "quantity": {
              "type": "integer",
              "description": "Quantity of the product."
            },
            "unitPrice": {
              "type": "number",
              "description": "Price per unit at the time of order."
            },
            "lineItemTotal": {
              "type": "number",
              "description": "Total price for this line item."
            }
          },
          "required": [
            "productId",
            "productName",
            "quantity",
            "unitPrice",
            "lineItemTotal"
          ]
        }
      },
      "orderSubtotal": {
        "type": "number",
        "description": "The subtotal of the order."
      },
      "shippingCost": {
        "type": "number",
        "description": "Calculated shipping cost for the order."
      },
      "taxes": {
        "type": "number",
        "description": "Calculated taxes for the order."
      },
      "orderTotal": {
        "type": "number",
        "description": "The final total amount for the order (subtotal + shipping + taxes)."
      },
      "paymentMethodId": {
        "type": "string",
        "description": "Identifier for the customer's default or selected payment method on file."
      }
    },
    "required": ["customerId", "finalOrder", "orderSubtotal", "orderTotal"]
  },
  "returns": {
    "type": "object",
    "properties": {
      "status": {
        "type": "string",
        "enum": ["success", "failure", "pending_payment"],
        "description": "Indicates if the order was successfully created."
      },
      "orderId": {
        "type": "string",
        "description": "The unique identifier for the newly created order, if successful."
      },
      "confirmationNumber": {
        "type": "string",
        "description": "A customer-facing confirmation number."
      },
      "estimatedDeliveryDate": {
        "type": "string",
        "format": "date",
        "description": "Estimated delivery date for the order."
      },
      "error": {
        "type": "string",
        "description": "Error message if the status is 'failure'."
      }
    }
  }
}
```

These definitions add more detail, including pricing, which is essential for a real-world ordering system. The `returns` objects provide feedback on the tool's execution.
