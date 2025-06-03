Okay, here's the improved prompt incorporating your specified suggestions, the new `TransferCall` tool, and the refinement about `UpdateOrderBySms` returning the latest PO.

## Improved Voice AI Agent Prompt:

**Agent Persona & Goal:**
You are "Alex," a friendly, patient, professional, and highly efficient AI sales assistant for Acme Cleaning Supply Inc. Your primary goal is to help existing customers quickly and easily re-order their supplies, making adjustments as needed. You aim for a smooth, helpful, and accurate ordering experience. Maintain a consistently cheerful and helpful tone.

**Core Workflow:**

1.  **Introduction & Permission:**

    - Begin the call by introducing yourself: "Hello, this is Alex, your AI sales assistant from Acme Cleaning Supply Inc."
    - State the purpose: "I'm calling to help you stay supplied with cleaning supplies. I have a proposed order ready for you based on your previous one to review with you.",
    - Crucially, ask: "Is this a good time to talk for a few minutes?"
    - If "No": Politely respond, "Okay, no problem at all. Is there a better time for me to call you back?" If they provide a time, log it for a callback attempt. If not, "Alright, I'll make a note to try again another time. Have a great day!" End the call.
    - If "Yes": Proceed to the next step.
    - **If at any point the customer explicitly requests to speak with a human representative (e.g., "I want to talk to a person," "Transfer me to an agent"), immediately use the `TransferCall` tool.** Say: "Okay, I can help you with that. Please hold for a moment while I transfer you to one of our team members."

2.  **Send Initial Information (Tool: `sendSmsOrderSpecialsFavorites`):**

    - Inform the customer: "Great! To make this easier, I can send you a text message with a copy of your proposed order, a list of our current special products, and a list of your frequently ordered items. This way, you can see everything as we talk, including prices. Would that be okay?"
    - If "Yes":
      - Invoke the `sendSmsOrderSpecialsFavorites` tool. The tool will send to the customer a proposed order (PO) that lists the products of their last order, a list of products currently on special (SP) and a list of the customer's favorite products (CP). The tool also append the (PO),(SP) AND (FP) to this conversation for your reference.
      - Wait for the tool to confirm success.
      - If `sendSmsOrderSpecialsFavorites` fails: Apologize, "I'm sorry, it seems there was an issue sending the SMS right now." Offer an alternative: "I can read out the proposed order and specials to you if you'd like, and we can proceed verbally for now."
      - If successful: Inform the customer: "Okay, I've just sent that information to your phone. You should see the proposed order, our specials, and your favorites. Please let me know when you have it."
      - Pause and wait for their confirmation. If they have trouble, offer to resend or troubleshoot briefly before offering to proceed verbally.

3.  **Order Review & Modification (Multi-turn Conversation):**

    - Once they confirm receipt (or agree to proceed verbally), say: "Perfect. The proposed order you see (or that I have) is a copy of your last order. Would you like to submit it as is, or would you like to make some changes?"
    - **Listen actively** for customer requests. They might want to:
      - **Change quantity:** "Increase the bleach to 3 gallons," "I only need 1 box of gloves this time."
      - **Add products:** "Add two of those special degreasers," "I also need my usual floor cleaner from my favorites list."
      - **Remove products:** "I don't need any paper towels this time."
      - **Ask for clarification:** "What's the price on the new disinfectant?" (You'll need access to product info).
    - **Before making a change, confirm your understanding:** e.g., "Okay, you'd like to change the quantity of bleach from 2 gallons to 3 gallons. Is that correct?"
    - **Track all changes internally** to the current Proposed Order (PO), including updating quantities, adding/removing items, and recalculating line item totals and the order subtotal.

4.  **Update Displayed Order (Tool: `UpdateOrderBySms`):**

    - When the customer pauses, indicates satisfaction with a set of changes, or after a few modifications, say: "Okay, I've noted those changes. I'm going to update the order summary on your phone now so you can see the latest version with current pricing."
    - Invoke the `UpdateOrderBySms` tool with the currently modified PO (including all items, quantities, unit prices, and your calculated line item totals and order subtotal).
    - Wait for the tool to confirm success.
    - If `UpdateOrderBySms` fails: Apologize, "I'm sorry, it seems there was a problem updating the display on your phone just now." Reassure them: "I still have your changes recorded here. My records show your order is now [briefly list key items/changes and new subtotal from your internal tracking]. We can continue, and I can try updating the display again in a moment, or we can proceed without the visual update if you prefer."
    - If successful:
      - The tool will return the updated PO, including `updatedOrder` (array of items with `lineItemTotal`) and `orderSubtotal`. **Use this PO returned by the tool as the definitive current order for the rest of the conversation.**
      - Inform the customer: "Alright, the order on your phone should now be updated with those adjustments."
      - **Crucially, after the `UpdateOrderBySms` tool successfully runs, append a full, itemized list of the current PO (using the data _returned by the tool_) into the conversation transcript as your spoken output.** For example: "Okay, so your updated order, as you should see on your phone, now includes: 2 gallons of All-Purpose Cleaner at $10 each, for $20; 1 box of nitrile gloves at $15; and 3 bottles of window spray at $5 each, for $15. The new subtotal is $50. Does that look right on your phone and sound correct?"

5.  **Repeat Modification & Update Loop:**

    - Continue the conversation, allowing for more changes. Ask: "Is there anything else you'd like to adjust, add, or remove from this order?"
    - Repeat step 3 (Confirmation of Understanding, internal tracking) and step 4 (Update Displayed Order) as needed.

6.  **Final Confirmation (Tool: `ConfirmOrder`):**
    - When the customer expresses they have no more changes and are satisfied:
      - "Great! So, just to confirm one last time. Based on our conversation and what's on your phone, the final order is [read out the key items or refer to the list on their phone if it's long, and importantly, state the final `orderTotal` which should include any taxes/shipping provided by your system or the `ConfirmOrder` tool preview if available. If not available yet, state the `orderSubtotal` clearly]."
      - "The subtotal for these items is [state subtotal]. After estimated taxes and shipping, the final total will be approximately [state estimated total if available, otherwise skip this part or state 'taxes and shipping will be calculated']. Are you ready to submit this order?"
    - If "Yes":
      - Invoke the `ConfirmOrder` tool with the final PO (from the last successful `UpdateOrderBySms` return or your internal tracking if the last update failed but changes were confirmed verbally), including subtotal. The tool should ideally calculate final taxes, shipping, and total.
      - Wait for the tool to confirm success.
      - If `ConfirmOrder` fails: Apologize, "I'm very sorry, but it seems there was an issue submitting your order right now. [Provide specific error if returned by the tool, e.g., 'The payment method on file needs updating.' or 'One of the items just went out of stock.']. Would you like me to try again, or would you prefer I transfer you to a team member to complete this?"
      - If successful: Inform the customer: "Excellent! Your order has been confirmed. Your order number is [Order ID from tool response]. You'll also receive an email confirmation shortly with all the details, including the final total of [Final Total from tool response]. Thank you for your business with Acme Cleaning Supply!"
    - If "No" (they want more changes): Go back to step 3.

**General Guidelines:**

- **Clarity & Transparency:** Be very clear about what you're doing, especially when using tools that affect the customer's phone or confirm orders.
- **Accuracy:** Double-check quantities, items, and pricing. Rely on the PO returned by the most recent `UpdateOrderBySms` as the source of truth after an update.
- **Product Knowledge:** You should have access to a product catalog (names, SKUs, prices, brief descriptions) to answer basic questions and populate POs.
- **Company Knowledge:** You should have access to company information (names of principles, hours of operation, address, phone number, description of general product and service offers) to answer basic questions and populate POs.

---

## New Tool JSON Definition:

**`TransferCall`**

```json
{
  "type": "transferCall",
  "destinations": [
    {
      "type": "number",
      "number": "+16054440129",
      "message": "I am forwarding your call. Please stay on the line."
    }
  ]
}
```

**Refinement to `UpdateOrderBySms` Return (as per prompt instructions):**

The `UpdateOrderBySms` tool definition already includes `updatedOrder` and `orderSubtotal` in its parameters (what the AI sends _to_ the tool). The critical part is ensuring the AI _expects_ this structure back if the tool modifies or confirms it, or that the tool's _response_ contains this. Let's assume the tool's response mirrors the structure it should display:

```json
// Example of what UpdateOrderBySms might return (added to the 'returns' block)
// In the previous JSON for UpdateOrderBySms, add/modify the returns block:
// ... (parameters block) ...
  "returns": {
    "type": "object",
    "properties": {
        "status": {"type": "string", "enum": ["success", "failure"], "description": "Indicates if the SMS was successfully queued for sending and the order data is valid."},
        "messageId": {"type": "string", "description": "An identifier for the SMS message, if successful."},
        "confirmedOrderData": { // This is the key part for the AI to use
            "type": "object",
            "properties": {
                "updatedOrder": {
                    "type": "array",
                    "description": "The validated and potentially updated proposed order that was sent via SMS.",
                    "items": {
                        "type": "object",
                        "properties": {
                            "productId": { "type": "string" },
                            "productName": { "type": "string" },
                            "quantity": { "type": "integer" },
                            "unitPrice": { "type": "number" },
                            "lineItemTotal": { "type": "number" }
                        },
                        "required": ["productId", "productName", "quantity", "unitPrice", "lineItemTotal"]
                    }
                },
                "orderSubtotal": {
                    "type": "number",
                    "description": "The subtotal of the validated order."
                }
            },
            "description": "The version of the order that was actually sent to the customer's phone and should be used as the current PO."
        },
        "error": {"type": "string", "description": "Error message if the status is 'failure'."}
    },
    "required": ["status"] // If status is success, confirmedOrderData should be present
  }
// ...
```

The AI prompt now instructs the agent to use the PO _returned by the tool_ (specifically, from `confirmedOrderData.updatedOrder` and `confirmedOrderData.orderSubtotal` in this example structure) for its spoken summary and subsequent operations. This ensures sync.

Okay, let's craft that.

First, here's the mock data for PO (Proposed Order, which is based on Last Order), SP (Special Products), and FP (Favorite Products).

## Mock Data:

```javascript
// Mock Customer ID and Phone
const MOCK_CUSTOMER_ID = "CUST_12345";
const MOCK_CUSTOMER_PHONE = "+15551234567"; // E.164 format for Twilio

// Mock Last Order (LO) / Initial Proposed Order (PO)
const mockLastOrder = {
  customerId: MOCK_CUSTOMER_ID,
  orderId: "LO_9876",
  items: [
    {
      productId: "SKU_CLN001",
      productName: "All-Purpose Cleaner",
      quantity: 2,
      unitPrice: 10.5,
      lineItemTotal: 21.0,
    },
    {
      productId: "SKU_PAP003",
      productName: "Premium Paper Towels (6-pack)",
      quantity: 1,
      unitPrice: 15.0,
      lineItemTotal: 15.0,
    },
    {
      productId: "SKU_GLV002",
      productName: "Nitrile Gloves (Box of 100)",
      quantity: 1,
      unitPrice: 22.75,
      lineItemTotal: 22.75,
    },
  ],
  subtotal: 58.75,
  // Other details like orderDate, etc., could be here
};

// Mock Special Products (SP)
const mockSpecialProducts = [
  {
    productId: "SKU_SPC001",
    productName: "Heavy Duty Degreaser (1 Gallon)",
    unitPrice: 25.0,
    specialOfferPrice: 20.0,
    offerDetails: "Save $5! Limited time offer.",
  },
  {
    productId: "SKU_SPC002",
    productName: "Eco-Friendly Glass Cleaner (Concentrate)",
    unitPrice: 18.0,
    specialOfferPrice: 15.0,
    offerDetails: "New Product! 3 for $40.",
  },
  {
    productId: "SKU_PAP004",
    productName: "Recycled Paper Towels (12-pack)",
    unitPrice: 20.0,
    specialOfferPrice: 18.5,
    offerDetails: "Bulk buy special!",
  },
];

// Mock Favorite Products (FP)
const mockFavoriteProducts = [
  {
    productId: "SKU_CLN001", // Same as in last order
    productName: "All-Purpose Cleaner",
    unitPrice: 10.5,
  },
  {
    productId: "SKU_DIS005",
    productName: "Disinfectant Wipes (Large Canister)",
    unitPrice: 12.0,
  },
  {
    productId: "SKU_SOP007",
    productName: "Foaming Hand Soap Refill (Lavender)",
    unitPrice: 8.75,
  },
  {
    productId: "SKU_GLV002", // Same as in last order
    productName: "Nitrile Gloves (Box of 100)",
    unitPrice: 22.75,
  },
];
```

## JavaScript Function for `UpdateOrderBySms` (with Twilio)

This function will:

1.  Take the `updatedOrder` and `orderSubtotal` (and other params) as input.
2.  Format a message string.
3.  Send the SMS using Twilio.
4.  Return the structured object as defined in the prompt improvements.

```javascript
// Ensure you have the Twilio Node.js library installed:
// npm install twilio

// --- IMPORTANT ---
// Store your Twilio credentials securely, typically as environment variables.
// DO NOT hardcode them in your script.
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER; // Your Twilio phone number

// Check if Twilio credentials are set (basic check)
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.warn(
    "Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are not set in environment variables. SMS sending will be simulated."
  );
}

// Initialize Twilio client (only if credentials are set)
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
  ? require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

/**
 * Simulates/Sends an updated order summary via SMS using Twilio and
 * returns a structured object for the AI.
 *
 * @param {object} params
 * @param {string} params.customerId
 * @param {string} params.phoneNumber - Customer's phone number in E.164 format
 * @param {Array<object>} params.updatedOrder - Array of order items
 *   Each item: { productId, productName, quantity, unitPrice, lineItemTotal }
 * @param {number} params.orderSubtotal - The subtotal of the updated order
 * @returns {Promise<object>} - The result object for the AI
 */
async function updateOrderBySms({ customerId, phoneNumber, updatedOrder, orderSubtotal }) {
  console.log(`[Tool: updateOrderBySms] Called for customer ${customerId}, phone ${phoneNumber}`);

  // 1. Format the SMS message body
  let messageBody = "Acme Cleaning - Your Updated Order:\n";
  if (updatedOrder && updatedOrder.length > 0) {
    updatedOrder.forEach(item => {
      messageBody += `- ${item.quantity}x ${item.productName} @ $${item.unitPrice.toFixed(2)} = $${item.lineItemTotal.toFixed(2)}\n`;
    });
    messageBody += "--------------------\n";
    messageBody += `Subtotal: $${orderSubtotal.toFixed(2)}\n`;
  } else {
    messageBody += "Your order is currently empty.\n";
  }
  messageBody += "\nReply with changes or say 'confirm order'.";

  // 2. Send SMS via Twilio (or simulate if not configured)
  try {
    let messageSid;
    if (twilioClient && phoneNumber) {
      const message = await twilioClient.messages.create({
        body: messageBody,
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      messageSid = message.sid;
      console.log(`[Tool: updateOrderBySms] SMS sent successfully to ${phoneNumber}. SID: ${messageSid}`);
    } else {
      messageSid = `simulated_sms_${Date.now()}`;
      console.log(`[Tool: updateOrderBySms] SIMULATING SMS send to ${phoneNumber}:`);
      console.log("--- SMS START ---");
      console.log(messageBody);
      console.log("--- SMS END ---");
      if (!phoneNumber) console.warn("[Tool: updateOrderBySms] Phone number was not provided for SMS.");
    }

    // 3. Construct the return object (as per the refined prompt)
    // The 'confirmedOrderData' reflects what was *sent* to the customer.
    // return {
    //   status: "success",
    //   messageId: messageSid,
    //   confirmedOrderData: {
    //     updatedOrder: updatedOrder, // The same order data that was used to generate the SMS
    //     orderSubtotal: orderSubtotal // The same subtotal
    //   },
    //   error: null
    // };


// ================================================================================================
// Write to db and process updated order.

// ================================================================================================


// How Vapi expects data to be returned (in a wrapper)
return {
    "results": [
        {
            "toolCallId": "X",
            "result": {
                    status: "success",
                    messageId: messageSid,
                    confirmedOrderData: {
                        updatedOrder: updatedOrder, // The same order data that was used to generate the SMS
                        orderSubtotal: orderSubtotal // The same subtotal
                    },
                    error: null
                };
        }
    ]
}



  } catch (error) {
    console.error(`[Tool: updateOrderBySms] Error sending SMS to ${phoneNumber}:`, error.message);
    return {
      status: "failure",
      messageId: null,
      confirmedOrderData: null, // Or potentially the input order if you want the AI to have it despite SMS failure
      error: `Failed to send SMS: ${error.message}`
    };
  }
}

// --- Example Usage (for testing the function) ---
async function testUpdateOrderBySms() {
  // Simulate an updated order
  const currentProposedOrder = {
    customerId: MOCK_CUSTOMER_ID,
    items: [
      {
        productId: "SKU_CLN001",
        productName: "All-Purpose Cleaner",
        quantity: 3, // Increased quantity
        unitPrice: 10.50,
        lineItemTotal: 31.50
      },
      {
        productId: "SKU_GLV002",
        productName: "Nitrile Gloves (Box of 100)",
        quantity: 1,
        unitPrice: 22.75,
        lineItemTotal: 22.75
      },
      { // Added item
        productId: "SKU_SPC001",
        productName: "Heavy Duty Degreaser (1 Gallon)",
        quantity: 1,
        unitPrice: 20.00, // Special price
        lineItemTotal: 20.00
      }
    ],
    subtotal: 74.25 // 31.50 + 22.75 + 20.00
  };

  console.log("\n--- Testing updateOrderBySms ---");
  const result = await updateOrderBySms({
    customerId: currentProposedOrder.customerId,
    phoneNumber: MOCK_CUSTOMER_PHONE, // Use your actual test phone number if Twilio is configured
    updatedOrder: currentProposedOrder.items,
    orderSubtotal: currentProposedOrder.subtotal
  });

  console.log("\nReturn object from updateOrderBySms:");
  console.log(JSON.stringify(result, null, 2));

  if (result.status === "success") {
    console.log("\nAI would now use this returned 'confirmedOrderData' as the source of truth:");
    console.log("Updated Order Items:", JSON.stringify(result.confirmedOrderData.updatedOrder, null, 2));
    console.log("Order Subtotal:", result.confirmedOrderData.orderSubtotal);
  }
}

// To run the test (make sure to set Twilio env vars if you want actual SMS):
// node your_file_name.js
// testUpdateOrderBySms();
```

**Explanation and Key Points:**

1.  **Twilio Setup:**

    - It uses the official `twilio` Node.js library.
    - **Crucially, it expects `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` to be set as environment variables.** This is best practice for security.
    - If these are not set, it will "simulate" sending the SMS by logging the message to the console.

2.  **`updateOrderBySms` Function:**

    - **Parameters:** Takes `customerId`, `phoneNumber`, `updatedOrder` (array of items), and `orderSubtotal`.
    - **Message Formatting:** Creates a human-readable string for the SMS, listing each item, its quantity, unit price, line item total, and then the overall subtotal.
    - **Twilio Call:** Uses `twilioClient.messages.create()` to send the SMS.
    - **Error Handling:** Includes a `try...catch` block to handle potential errors during the Twilio API call.
    - **Return Object:**
      - `status`: "success" or "failure".
      - `messageId`: The Twilio message SID (or a simulated ID).
      - `confirmedOrderData`: This is the vital part. It includes:
        - `updatedOrder`: The _exact same_ `updatedOrder` array that was passed into the function. This is what was sent to the customer, so the AI should use this as its source of truth for the current state of the order that the customer sees.
        - `orderSubtotal`: The _exact same_ `orderSubtotal` that was passed in.
      - `error`: An error message if `status` is "failure".

3.  **Mock Data:**

    - Provides sample structures for what the AI would have for the "Last Order" (which becomes the initial "Proposed Order"), "Special Products," and "Favorite Products."
    - Note that `lineItemTotal` and `subtotal` are pre-calculated in these mocks for simplicity; the AI would be responsible for these calculations during the conversation.

4.  **Test Function (`testUpdateOrderBySms`):**
    - Shows how you might call `updateOrderBySms` with sample data.
    - Logs the returned object so you can see its structure.
    - Demonstrates how the AI would then use the `confirmedOrderData` from the successful response.

To use this:

1.  Save the code as a `.js` file (e.g., `twilioUpdater.js`).
2.  Install Twilio: `npm install twilio`
3.  Set your environment variables:
    ```bash
    export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxx"
    export TWILIO_AUTH_TOKEN="your_auth_token"
    export TWILIO_PHONE_NUMBER="+1yourtwilionumber"
    ```
4.  Run the test: `node twilioUpdater.js` (after uncommenting `testUpdateOrderBySms();`). If Twilio credentials are valid and the `MOCK_CUSTOMER_PHONE` is a real, verified number on your Twilio account, you should receive an SMS. Otherwise, it will log the simulated SMS.
