import twilio from "twilio";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Interface for order item data
 */
interface OrderItem {
  productName: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * Interface for SMS order update parameters
 */
interface sendSmsOrderSpecialsFavoritesParams {
  customerPhone: string;
  customerName: string;
  companyName: string;
  orderItems: OrderItem[];
  subtotal: number;
  gst: number;
  pst: number;
  total: number;
}

/**
 * Interface for SMS response
 */
interface SmsResponse {
  success: boolean;
  messageSid?: string;
  message: string;
  error?: string;
}

/**
 * Sends an SMS order update to a customer
 * @param params Order update parameters
 * @returns Response object with success status and details
 */
export const sendSmsOrderSpecialsFavorites = async (
  params: sendSmsOrderSpecialsFavoritesParams
): Promise<SmsResponse> => {
  console.log("Function: sendSmsOrderSpecialsFavorites.ts");
  console.log("Request params:", params);

  try {
    // Validate parameters
    if (
      !params.customerPhone ||
      !params.customerName ||
      !params.companyName ||
      !Array.isArray(params.orderItems)
    ) {
      throw new Error("Missing required parameters");
    }

    // Format values for proper display
    const subtotal = Number(params.subtotal).toFixed(2);
    const gst = Number(params.gst).toFixed(2);
    const pst = Number(params.pst).toFixed(2);
    const total = Number(params.total).toFixed(2);

    // Format the order items for display
    const itemsText = params.orderItems
      .map(
        (item) =>
          `• ${item.productName} (${item.size})\n  Qty: ${
            item.quantity
          } × $${Number(item.unitPrice).toFixed(2)} = $${Number(
            item.lineTotal
          ).toFixed(2)}`
      )
      .join("\n\n");

    // Construct the SMS message
    const message = `Order Update - ${params.companyName}

Hi ${params.customerName},

Your updated order:

${itemsText}

Subtotal: $${subtotal}
GST: $${gst}
PST: $${pst}
Total: $${total}

Reply to confirm or call to make changes.`;

    // Check if we're in test mode
    // const isTestMode = process.env.SMS_TEST_MODE === "true";
    const isTestMode = false;
    let result: any;

    if (isTestMode) {
      // In test mode, just log the message
      console.log("TEST MODE: SMS would be sent with content:");
      console.log(message);
      result = { sid: "TEST_SID_" + Date.now() };
    } else {
      // Initialize Twilio client
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        throw new Error(
          "Missing Twilio configuration. Check environment variables."
        );
      }

      const client = twilio(accountSid, authToken);

      // Send SMS via Twilio
      result = await client.messages.create({
        body: message,
        from: fromNumber,
        to: params.customerPhone,
        // to: "+17787754146",
      });

      console.log(
        `Really sebt sms to ${params.customerPhone} with SID: ${result.sid}`
      );
    }

    console.log(`SMS sent successfully. SID: ${result.sid}`);
    return {
      success: true,
      messageSid: result.sid,
      message: "Order update sent successfully via SMS",
    };
  } catch (error: any) {
    console.error("Error sending SMS:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to send SMS order update",
    };
  }
};

/**
 * Test the SMS function with sample data
 */
export const test_sendSmsOrderSpecialsFavorites = () => {
  const testParams: sendSmsOrderSpecialsFavoritesParams = {
    customerPhone: "+17787754146",
    customerName: "James Wilson",
    companyName: "Acme Cleaning and Safety Supply Inc.",
    orderItems: [
      {
        productName: "Disinfectant Wipes",
        size: "160 count",
        quantity: 4,
        unitPrice: 12.99,
        lineTotal: 51.96,
      },
      {
        productName: "Hand Sanitizer Gel",
        size: "1 Gallon",
        quantity: 2,
        unitPrice: 29.99,
        lineTotal: 59.98,
      },
    ],
    subtotal: 111.94,
    gst: 7.84,
    pst: 6.72,
    total: 126.5,
  };

  console.log("Running test for sendSmsOrderSpecialsFavorites...");
  return sendSmsOrderSpecialsFavorites(testParams);
};

// Allow running the test directly when this file is executed
if (require.main === module) {
  console.log("Running SMS order update test...");
  // Set test mode to true to prevent actual SMS sending during test
  process.env.SMS_TEST_MODE = "true";
  test_sendSmsOrderSpecialsFavorites()
    .then((result) => {
      console.log("Test result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("Test failed:", error);
      process.exit(1);
    });
}
