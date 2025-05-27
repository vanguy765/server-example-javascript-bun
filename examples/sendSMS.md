System Prompt

Drop here to insert into user message
Max 100 files at 5MB each
User
Extracted customer: {
id: "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a",
phone: "+12175553456",
last_name: "Wilson",
first_name: "James",
}

Extracted company: {
id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
name: "Acme Cleaning and Safety Supply Inc.",
domain: "acmecleaning.com",
}

reorderbot_originalAdjusted: formattedProposedOrder: {
proposed_order: "2950963c-7f41-4739-8296-9ee0e0f0a6bd",
order_date: "2025-05-19T05:47:46.28778+00:00",
status: "confirmed",
lineItems: [
{
id: "c832c2be-f827-4e86-b249-7b0559d1a4c4",
product: {
id: "5c6d7e8f-9a0b-4f9b-d3e4-f5a6b7c8d9e0",
name: "Disinfectant Wipes",
size: "160 count",
price: 12.99,
description: "Pre-moistened disinfectant wipes for quick surface disinfection",
},
quantity: 4,
lineTotal: 51.96,
}, {
id: "2ab94983-72f8-4a33-9d1b-92d09a330ce8",
product: {
id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
name: "Hand Sanitizer Gel",
size: "1 Gallon",
price: 29.99,
description: "70% alcohol-based hand sanitizer gel with pump",
},
quantity: 2,
lineTotal: 59.98,
}, {
id: "5797f2e5-5c37-4a66-8010-dfabf99dcc25",
product: {
id: "0d1e2f3a-4b5c-4a46-8f9a-0b1c2d3e4f5a",
name: "Heavy-Duty Chemical Resistant Gloves",
size: "Medium (5 pack)",
price: 18.99,
description: "Reusable gloves for handling strong chemicals",
},
quantity: 1,
lineTotal: 18.99,
}
],
subTotal: 130.93,
GST: 9.17,
PST: 7.86,
total: 147.96,
}

==================================================

Transformed product specials: [
{
id: "8f9a0b1c-2d3e-4c2e-a6b7-c8d9e0f1a2b3",
name: "HEPA Air Purifier",
description: "True HEPA air purifier for spaces up to 1500 sq ft",
price: 279.99,
size: "Large Room (1 unit)",
discount: 20,
end_date: "2025-06-30T23:59:59+00:00",
regular_price: 349.99,
}, {
id: "8b9c0d1e-2f3a-4e24-6d7e-8f9a0b1c2d3e",
name: "Commercial Wet/Dry Vacuum",
description: "Heavy-duty vacuum for both wet and dry debris",
price: 212.49,
size: "16 Gallon",
discount: 15,
end_date: "2025-06-15T23:59:59+00:00",
regular_price: 249.99,
}, {
id: "1a2b3c4d-5e6f-47b8-9c0d-1e2f3a4b5c6d",
name: "Industrial Floor Cleaner",
description: "Heavy-duty floor cleaner for commercial spaces",
price: 80.99,
size: "5 Gallon",
discount: 10,
end_date: "2025-07-11T23:59:59+00:00",
regular_price: 89.99,
}
]

==============================================================

Favorite products details: {
data: [
{
id: "7a8b9c0d-1e2f-4d13-5c6d-7e8f9a0b1c2d",
name: "Microfiber Cleaning Cloths",
description: "Multi-purpose microfiber cloths for various cleaning tasks",
size: "24 Pack",
price: 29.99,
}, {
id: "9c0d1e2f-3a4b-4f35-7e8f-9a0b1c2d3e4f",
name: "Nitrile Gloves",
description: "Disposable nitrile gloves, powder-free, large size",
size: "Large (100 count)",
price: 24.95,
}, {
id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
name: "Hand Sanitizer Gel",
description: "70% alcohol-based hand sanitizer gel with pump",
size: "1 Gallon",
price: 29.99,
}
],
error: null,
}

The above are data objects within a prompt for a voice ai agent. The agent will speak with the user who will edit their proposed order items list by deleting items or changing quantities, or adding items from the specials of favorites list. These changes are communicated via a tool sendSmsOrderUpdate to update the users phone with an updated proposed order. Please give the instruction to include in the prompt to direct the agent to use the sendSmsOrderUpdate, give the sendSmsOrderUpdate tool definition and give the function to send the sms using Twilio.

Assistant
Here are the three components you requested:

## 1. Agent Instructions for Prompt

```

## Order Management Instructions

You are helping the customer review and modify their proposed order. The customer can:

- Remove items from their current order
- Change quantities of existing items
- Add items from the current specials list
- Add items from their favorite products list

**Important**: After ANY modification to the order (adding, removing, or changing quantities), you MUST use the `sendSmsOrderUpdate` tool to send an updated order summary to the customer's phone. This ensures they have a written record of their current order state.

When calling `sendSmsOrderUpdate`:

- Recalculate all totals (subtotal, taxes, final total)
- Include all line items with quantities and line totals
- Use a clear, concise format that's easy to read on mobile
- Always send the update immediately after confirming the change with the customer

```

## 2. Tool Definition

```json
{
  "name": "sendSmsOrderUpdate",
  "description": "Send an updated order summary via SMS to the customer after any order modifications",
  "parameters": {
    "type": "object",
    "properties": {
      "customerPhone": {
        "type": "string",
        "description": "Customer's phone number in E.164 format (e.g., +12175553456)"
      },
      "customerName": {
        "type": "string",
        "description": "Customer's full name"
      },
      "companyName": {
        "type": "string",
        "description": "Customer's company name"
      },
      "orderItems": {
        "type": "array",
        "description": "Array of order line items",
        "items": {
          "type": "object",
          "properties": {
            "productName": {
              "type": "string",
              "description": "Name of the product"
            },
            "size": {
              "type": "string",
              "description": "Product size/packaging"
            },
            "quantity": {
              "type": "integer",
              "description": "Quantity ordered"
            },
            "unitPrice": {
              "type": "number",
              "description": "Price per unit"
            },
            "lineTotal": {
              "type": "number",
              "description": "Total for this line item (quantity × unitPrice)"
            }
          },
          "required": [
            "productName",
            "size",
            "quantity",
            "unitPrice",
            "lineTotal"
          ]
        }
      },
      "subtotal": {
        "type": "number",
        "description": "Order subtotal before taxes"
      },
      "gst": {
        "type": "number",
        "description": "GST tax amount"
      },
      "pst": {
        "type": "number",
        "description": "PST tax amount"
      },
      "total": {
        "type": "number",
        "description": "Final total including all taxes"
      }
    },
    "required": [
      "customerPhone",
      "customerName",
      "companyName",
      "orderItems",
      "subtotal",
      "gst",
      "pst",
      "total"
    ]
  }
}
```

## 3. Twilio SMS Function

```javascript
const twilio = require("twilio");

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSmsOrderUpdate(params) {
  try {
    const {
      customerPhone,
      customerName,
      companyName,
      orderItems,
      subtotal,
      gst,
      pst,
      total,
    } = params;

    // Format the order items
    const itemsText = orderItems
      .map(
        (item) =>
          `• ${item.productName} (${item.size})\n  Qty: ${
            item.quantity
          } × $${item.unitPrice.toFixed(2)} = $${item.lineTotal.toFixed(2)}`
      )
      .join("\n\n");

    // Construct the SMS message
    const message = `Order Update - ${companyName}

Hi ${customerName},

Your updated order:

${itemsText}

Subtotal: $${subtotal.toFixed(2)}
GST: $${gst.toFixed(2)}
PST: $${pst.toFixed(2)}
Total: $${total.toFixed(2)}

Reply to confirm or call to make changes.`;

    // Send SMS via Twilio
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
      to: customerPhone,
    });

    console.log(`SMS sent successfully. SID: ${result.sid}`);
    return {
      success: true,
      messageSid: result.sid,
      message: "Order update sent successfully via SMS",
    };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send SMS order update",
    };
  }
}

module.exports = { sendSmsOrderUpdate };
```

## Environment Variables Required

Make sure to set these environment variables:

```

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

The SMS message will be formatted clearly for mobile viewing and include all order details with proper formatting for easy readability.

Drop here to insert into user message
Max 100 files at 5MB each
User

Give the code for the endpoint that receives the tool call sendSmsOrderUpdate and invokes sendSmsOrderUpdate these calculations completed

// Add calculations for line totals, subtotal, taxes, and grand total
const proposedOrder = proposedOrder_temp;

if (proposedOrder?.data) {
const orderData = proposedOrder.data;

    // Calculate lineTotal for each line item
    let subTotal = 0;
    if (orderData.lineItems) {
      orderData.lineItems.forEach((item) => {
        const lineTotal = item.product.price * item.quantity;
        item.lineTotal = Number(lineTotal.toFixed(2));
        subTotal += lineTotal;
      });
    }

    // Round subtotal to 2 decimal places
    subTotal = Number(subTotal.toFixed(2));

    // Calculate tax amounts
    const GST = Number((subTotal * 0.07).toFixed(2));
    const PST = Number((subTotal * 0.06).toFixed(2));
    const total = Number((subTotal + GST + PST).toFixed(2));

    // Add financial totals to the order data
    let formattedProposedOrder = {
      ...orderData,
      subTotal,
      GST,
      PST,
      total,
    };

Assistant
Here's the endpoint code that receives the tool call and invokes the SMS function:

```javascript
const express = require("express");
const { sendSmsOrderUpdate } = require("./smsService"); // Adjust path as needed
const router = express.Router();

router.post("/send-order-update", async (req, res) => {
  try {
    const {
      customerPhone,
      customerName,
      companyName,
      orderItems,
      subtotal,
      gst,
      pst,
      total,
    } = req.body;

    // Validate required fields
    if (!customerPhone || !customerName || !companyName || !orderItems) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: customerPhone, customerName, companyName, orderItems",
      });
    }

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "orderItems must be a non-empty array",
      });
    }

    // Create a temporary order structure for calculations
    const proposedOrder_temp = {
      data: {
        lineItems: orderItems.map((item) => ({
          product: {
            name: item.productName,
            size: item.size,
            price: item.unitPrice,
          },
          quantity: item.quantity,
        })),
      },
    };

    // Perform the calculations
    const proposedOrder = proposedOrder_temp;
    if (proposedOrder?.data) {
      const orderData = proposedOrder.data;

      // Calculate lineTotal for each line item
      let subTotal = 0;
      if (orderData.lineItems) {
        orderData.lineItems.forEach((item) => {
          const lineTotal = item.product.price * item.quantity;
          item.lineTotal = Number(lineTotal.toFixed(2));
          subTotal += lineTotal;
        });
      }

      // Round subtotal to 2 decimal places
      subTotal = Number(subTotal.toFixed(2));

      // Calculate tax amounts
      const GST = Number((subTotal * 0.07).toFixed(2));
      const PST = Number((subTotal * 0.06).toFixed(2));
      const total_calc = Number((subTotal + GST + PST).toFixed(2)); // Renamed to avoid conflict

      // Add financial totals to the order data
      let formattedProposedOrder = {
        ...orderData,
        subTotal,
        GST,
        PST,
        total: total_calc, // Use calculated total
      };

      // Prepare the SMS parameters with calculated values
      const smsParams = {
        customerPhone,
        customerName,
        companyName,
        orderItems: formattedProposedOrder.lineItems.map((item) => ({
          productName: item.product.name,
          size: item.product.size,
          quantity: item.quantity,
          unitPrice: item.product.price,
          lineTotal: item.lineTotal,
        })),
        subtotal: formattedProposedOrder.subTotal,
        gst: formattedProposedOrder.GST,
        pst: formattedProposedOrder.PST,
        total: formattedProposedOrder.total,
      };

      // Send the SMS
      const smsResult = await sendSmsOrderUpdate(smsParams);

      if (smsResult.success) {
        res.json({
          success: true,
          message: "Order update SMS sent successfully",
          orderSummary: formattedProposedOrder,
          smsDetails: {
            messageSid: smsResult.messageSid,
            sentTo: customerPhone,
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Failed to send SMS",
          details: smsResult.error,
          orderSummary: formattedProposedOrder,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid order data structure",
      });
    }
  } catch (error) {
    console.error("Error in send-order-update endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
```

## Alternative Express App Setup (if not using router):

```javascript
const express = require("express");
const { sendSmsOrderUpdate } = require("./smsService");
const app = express();
app.use(express.json());

app.post("/api/send-order-update", async (req, res) => {
  // ... (same code as above in the router.post handler)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Usage Example:

The AI agent would make a POST request to this endpoint with the following payload:

```json
{
  "customerPhone": "+12175553456",
  "customerName": "James Wilson",
  "companyName": "Acme Cleaning and Safety Supply Inc.",
  "orderItems": [
    {
      "productName": "Disinfectant Wipes",
      "size": "160 count",
      "quantity": 4,
      "unitPrice": 12.99
    },
    {
      "productName": "Hand Sanitizer Gel",
      "size": "1 Gallon",
      "quantity": 2,
      "unitPrice": 29.99
    }
  ]
}
```

## Key Features:

1. **Automatic Calculations**: The endpoint recalculates all totals based on the current order items
2. **Validation**: Checks for required fields and proper data structure
3. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
4. **Response**: Returns both success confirmation and the calculated order summary
5. **SMS Integration**: Calls the Twilio SMS function with properly formatted data

The endpoint will automatically calculate line totals, subtotal, taxes (7% GST, 6% PST), and the final total before sending the SMS update to the customer.

Drop here to insert into user message
Max 100 files at 5MB each
User
What is the best way to include the data objects, wrap them in xml tags?

Assistant
Yes, wrapping data objects in XML tags is an excellent approach for AI prompts! It provides clear structure and makes it easier for the AI to parse and reference specific data sections. Here's the recommended way to structure it:

## Recommended XML Structure:

```xml

<customer_data>
{
  id: "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a",
  phone: "+12175553456",
  last_name: "Wilson",
  first_name: "James",
}
</customer_data>

<company_data>
{
  id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
  name: "Acme Cleaning and Safety Supply Inc.",
  domain: "acmecleaning.com",
}
</company_data>

<current_order>
{
  proposed_order: "2950963c-7f41-4739-8296-9ee0e0f0a6bd",
  order_date: "2025-05-19T05:47:46.28778+00:00",
  status: "confirmed",
  lineItems: [
    {
      id: "c832c2be-f827-4e86-b249-7b0559d1a4c4",
      product: {
        id: "5c6d7e8f-9a0b-4f9b-d3e4-f5a6b7c8d9e0",
        name: "Disinfectant Wipes",
        size: "160 count",
        price: 12.99,
        description: "Pre-moistened disinfectant wipes for quick surface disinfection",
      },
      quantity: 4,
      lineTotal: 51.96,
    },
    // ... more items
  ],
  subTotal: 130.93,
  GST: 9.17,
  PST: 7.86,
  total: 147.96,
}
</current_order>

<available_specials>
[
  {
    id: "8f9a0b1c-2d3e-4c2e-a6b7-c8d9e0f1a2b3",
    name: "HEPA Air Purifier",
    description: "True HEPA air purifier for spaces up to 1500 sq ft",
    price: 279.99,
    size: "Large Room (1 unit)",
    discount: 20,
    end_date: "2025-06-30T23:59:59+00:00",
    regular_price: 349.99,
  },
  // ... more specials
]
</available_specials>

<favorite_products>
{
  data: [
    {
      id: "7a8b9c0d-1e2f-4d13-5c6d-7e8f9a0b1c2d",
      name: "Microfiber Cleaning Cloths",
      description: "Multi-purpose microfiber cloths for various cleaning tasks",
      size: "24 Pack",
      price: 29.99,
    },
    // ... more favorites
  ],
  error: null,
}
</favorite_products>
```

## Benefits of This Approach:

1. **Clear Separation**: Each data type is clearly delineated
2. **Easy Reference**: The AI can easily reference specific sections like "from the `<current_order>` data..."
3. **Better Parsing**: Many AI models are trained to recognize and work well with XML structures
4. **Semantic Meaning**: Tag names provide context about what the data represents
5. **Nested Structure**: Supports complex nested data while maintaining readability

## Alternative Approaches:

### Option 1: More Descriptive Tags

```xml

<customer_information>
<!-- customer data -->
</customer_information>

<company_information>
<!-- company data -->
</company_information>

<pending_order_details>
<!-- order data -->
</pending_order_details>

<current_promotional_offers>
<!-- specials data -->
</current_promotional_offers>

<customer_favorite_items>
<!-- favorites data -->
</customer_favorite_items>
```

### Option 2: Single Container with Sections

```xml

<order_management_data>
  <customer>
    <!-- customer data -->
  </customer>

  <company>
    <!-- company data -->
  </company>

  <current_order>
    <!-- order data -->
  </current_order>

  <specials>
    <!-- specials data -->
  </specials>

  <favorites>
    <!-- favorites data -->
  </favorites>
</order_management_data>
```

## Updated Agent Instructions:

```

## Order Management Instructions

You are helping the customer review and modify their proposed order using the data provided above.

**Available Data Sections:**
- `<customer_data>`: Customer contact information
- `<company_data>`: Customer's company details
- `<current_order>`: The customer's current proposed order with line items and totals
- `<available_specials>`: Current promotional items with discounts
- `<favorite_products>`: Customer's previously saved favorite items

The customer can:
- Remove items from their `<current_order>`
- Change quantities of existing items in their `<current_order>`
- Add items from the `<available_specials>` list
- Add items from their `<favorite_products>` list

**Important**: After ANY modification to the order, you MUST use the `sendSmsOrderUpdate` tool to send an updated order summary to the customer's phone using their information from `<customer_data>` and `<company_data>`.
```

The XML approach makes it much clearer for the AI to understand the data structure and reference specific sections in its responses and tool calls.

Drop here to insert into user message
Max 100 files at 5MB each
User
If valid, give all objects as

Const xmlProposedOrder =

`<proposedOrder>

${proposedOrder)

</proposedOrder>`

Assistant
Here are all the data objects formatted as XML template literals:

```javascript
const xmlCustomer = `<customer>
{
  id: "9d8f7e6d-5c4b-4a2b-8c0d-9e8f7d6c5b4a",
  phone: "+12175553456",
  last_name: "Wilson",
  first_name: "James",
}
</customer>`;

const xmlCompany = `<company>
{
  id: "f0555d1a-5da7-4d15-b864-a1c6b16458a8",
  name: "Acme Cleaning and Safety Supply Inc.",
  domain: "acmecleaning.com",
}
</company>`;

const xmlProposedOrder = `<proposedOrder>
{
  proposed_order: "2950963c-7f41-4739-8296-9ee0e0f0a6bd",
  order_date: "2025-05-19T05:47:46.28778+00:00",
  status: "confirmed",
  lineItems: [
    {
      id: "c832c2be-f827-4e86-b249-7b0559d1a4c4",
      product: {
        id: "5c6d7e8f-9a0b-4f9b-d3e4-f5a6b7c8d9e0",
        name: "Disinfectant Wipes",
        size: "160 count",
        price: 12.99,
        description: "Pre-moistened disinfectant wipes for quick surface disinfection",
      },
      quantity: 4,
      lineTotal: 51.96,
    }, {
      id: "2ab94983-72f8-4a33-9d1b-92d09a330ce8",
      product: {
        id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
        name: "Hand Sanitizer Gel",
        size: "1 Gallon",
        price: 29.99,
        description: "70% alcohol-based hand sanitizer gel with pump",
      },
      quantity: 2,
      lineTotal: 59.98,
    }, {
      id: "5797f2e5-5c37-4a66-8010-dfabf99dcc25",
      product: {
        id: "0d1e2f3a-4b5c-4a46-8f9a-0b1c2d3e4f5a",
        name: "Heavy-Duty Chemical Resistant Gloves",
        size: "Medium (5 pack)",
        price: 18.99,
        description: "Reusable gloves for handling strong chemicals",
      },
      quantity: 1,
      lineTotal: 18.99,
    }
  ],
  subTotal: 130.93,
  GST: 9.17,
  PST: 7.86,
  total: 147.96,
}
</proposedOrder>`;

const xmlSpecials = `<specials>
[
  {
    id: "8f9a0b1c-2d3e-4c2e-a6b7-c8d9e0f1a2b3",
    name: "HEPA Air Purifier",
    description: "True HEPA air purifier for spaces up to 1500 sq ft",
    price: 279.99,
    size: "Large Room (1 unit)",
    discount: 20,
    end_date: "2025-06-30T23:59:59+00:00",
    regular_price: 349.99,
  }, {
    id: "8b9c0d1e-2f3a-4e24-6d7e-8f9a0b1c2d3e",
    name: "Commercial Wet/Dry Vacuum",
    description: "Heavy-duty vacuum for both wet and dry debris",
    price: 212.49,
    size: "16 Gallon",
    discount: 15,
    end_date: "2025-06-15T23:59:59+00:00",
    regular_price: 249.99,
  }, {
    id: "1a2b3c4d-5e6f-47b8-9c0d-1e2f3a4b5c6d",
    name: "Industrial Floor Cleaner",
    description: "Heavy-duty floor cleaner for commercial spaces",
    price: 80.99,
    size: "5 Gallon",
    discount: 10,
    end_date: "2025-07-11T23:59:59+00:00",
    regular_price: 89.99,
  }
]
</specials>`;

const xmlFavorites = `<favorites>
{
  data: [
    {
      id: "7a8b9c0d-1e2f-4d13-5c6d-7e8f9a0b1c2d",
      name: "Microfiber Cleaning Cloths",
      description: "Multi-purpose microfiber cloths for various cleaning tasks",
      size: "24 Pack",
      price: 29.99,
    }, {
      id: "9c0d1e2f-3a4b-4f35-7e8f-9a0b1c2d3e4f",
      name: "Nitrile Gloves",
      description: "Disposable nitrile gloves, powder-free, large size",
      size: "Large (100 count)",
      price: 24.95,
    }, {
      id: "6d7e8f9a-0b1c-4a0c-e4f5-a6b7c8d9e0f1",
      name: "Hand Sanitizer Gel",
      description: "70% alcohol-based hand sanitizer gel with pump",
      size: "1 Gallon",
      price: 29.99,
    }
  ],
  error: null,
}
</favorites>`;
```

## Usage in Prompt:

```javascript
const prompt = `

## Order Management Instructions

You are helping the customer review and modify their proposed order using the data provided below.

${xmlCustomer}

${xmlCompany}

${xmlProposedOrder}

${xmlSpecials}

${xmlFavorites}

The customer can modify their order by adding, removing, or changing quantities. After any changes, use the sendSmsOrderUpdate tool with the customer and company information provided above.
`;
```

This approach makes the data easily insertable into prompts while maintaining clear XML structure for the AI to parse and reference.

Drop here to insert into user message
Max 100 files at 5MB each
User
