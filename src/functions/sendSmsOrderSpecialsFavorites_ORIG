import twilio from "twilio";
import dotenv from "dotenv";
import { getSafeRepository } from "../api/db-utils";
import { FunctionCallPayload, ToolCallsPayload } from "../types/vapi.types";

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
  customerPhone?: string;
  customerName?: string;
  companyName?: string;
  orderItems?: OrderItem[];
  subtotal?: number;
  gst?: number;
  pst?: number;
  total?: number;
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

interface ProposedSpecial {
  id: string;
  name: string;
  price: number;
  discount: number;
}

interface ProposedFavorite {
  id: string;
  name: string;
  lastOrderedDate: string;
}

interface OrderData {
  orderId?: string;
  orderDate?: string;
  lineItems: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

let orderData = {} as OrderData;

/**
 * Sends an SMS order update to a customer
 * @param params Order update parameters
 * @returns Response object with success status and details
 */
export const sendSmsOrderSpecialsFavorites = async (
  params: sendSmsOrderSpecialsFavoritesParams,
  payload?: FunctionCallPayload | ToolCallsPayload
): Promise<SmsResponse> => {
  console.log("File and Function: sendSmsOrderSpecialsFavorites.ts");
  // console.log("Request params:", params);
  // console.log("Request payload.call:", payload?.call);

  try {
    // Validate parameters
    // if (!params.customerPhone || !params.customerName || !params.companyName) {
    //   throw new Error("Missing required parameters");
    // }

    // Get call ID from payload
    const callId = payload?.call?.id;
    if (!callId) {
      throw new Error("Missing call ID in payload");
    }

    console.log(`Fetching proposed orders data for call ID: ${callId}`);

    // Get the repository for proposed_orders_data
    const proposedOrdersDataRepo = await getSafeRepository(
      "proposed_orders_data"
    );

    // Fetch data by call_id with each data_type
    const orderResult = await proposedOrdersDataRepo
      .query()
      .select("*")
      .eq("call_id", callId)
      .eq("data_type", "order")
      .maybeSingle();

    const specialsResult = await proposedOrdersDataRepo
      .query()
      .select("*")
      .eq("call_id", callId)
      .eq("data_type", "special")
      .maybeSingle();

    const favoritesResult = await proposedOrdersDataRepo
      .query()
      .select("*")
      .eq("call_id", callId)
      .eq("data_type", "favorites")
      .maybeSingle();

    console.log("=======================================");
    console.log("Order data:", orderResult?.data);
    console.log("Specials data:", specialsResult?.data);
    console.log("Favorites data:", favoritesResult?.data);

    // Extract order data for the SMS
    let orderItems: OrderItem[] = [];
    let subtotal = 0;
    let gst = 0;
    let pst = 0;
    let total = 0;

    if (orderResult?.data && orderResult.data.data) {
      orderData = orderResult.data.data as OrderData;

      // Transform the order items from the database format to the format needed for SMS
      orderItems = orderData.lineItems.map((item) => ({
        productName: item.name,
        size: "", // Size info might be part of the name or stored elsewhere
        quantity: item.quantity,
        unitPrice: item.price,
        lineTotal: item.quantity * item.price,
      }));

      // Calculate totals if not provided
      subtotal = orderData.lineItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      gst = subtotal * 0.05; // Assuming 5% GST, adjust as needed
      pst = subtotal * 0.07; // Assuming 7% PST, adjust as needed
      total = orderData.total || subtotal + gst + pst;
    } else {
      // Use provided order items if available
      orderItems = params.orderItems || [];
      subtotal = params.subtotal || 0;
      gst = params.gst || 0;
      pst = params.pst || 0;
      total = params.total || 0;
    }

    // Format values for proper display
    const subtotalFormatted = Number(subtotal).toFixed(2);
    const gstFormatted = Number(gst).toFixed(2);
    const pstFormatted = Number(pst).toFixed(2);
    const totalFormatted = Number(total).toFixed(2);

    // Format the order items for display
    const itemsText =
      orderItems.length > 0
        ? orderItems
            .map(
              (item) =>
                `• ${item.productName} ${
                  item.size ? `(${item.size})` : ""
                }\n  Qty: ${item.quantity} × $${Number(item.unitPrice).toFixed(
                  2
                )} = $${Number(item.lineTotal).toFixed(2)}`
            )
            .join("\n\n")
        : "No items in order";

    // Format specials if available
    let specialsText = "";
    if (
      specialsResult?.data &&
      specialsResult.data.data &&
      specialsResult.data.data.items
    ) {
      const specials = specialsResult.data.data.items as ProposedSpecial[];
      specialsText = specials
        .map(
          (special) =>
            `• ${special.name} - $${Number(special.price).toFixed(2)} (${(
              special.discount * 100
            ).toFixed(0)}% off)`
        )
        .join("\n");
    }

    // Format favorites if available
    let favoritesText = "";
    if (
      favoritesResult?.data &&
      favoritesResult.data.data &&
      favoritesResult.data.data.favorites
    ) {
      const favorites = favoritesResult.data.data
        .favorites as ProposedFavorite[];
      favoritesText = favorites
        .map(
          (favorite) =>
            `• ${favorite.name} (Last ordered: ${new Date(
              favorite.lastOrderedDate
            ).toLocaleDateString()})`
        )
        .join("\n");
    }

    // Construct the SMS message
    let message = `PROPOSED ORDER

${orderData.first_name} ${orderData.last_name},
Date: ${new Date().toLocaleDateString()}
From: ${params.companyName || orderData.company.name}

${itemsText}

Subtotal: $${subtotalFormatted}
GST: $${gstFormatted}
PST: $${pstFormatted}
Total: $${totalFormatted}`;

    // Add specials if available
    if (specialsText) {
      message += `

----- CURRENT SPECIALS -----
${specialsText}`;
    }

    // Add favorites if available
    if (favoritesText) {
      message += `

----- YOUR FAVORITES -----
${favoritesText}`;
    }

    message += `

Speak to change or confirm your order.`;

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

      //=======================================================
      // REPLACE ==============================================
      const toNumber = process.env.TWILIO_DEFAULT_TO_PHONE_NUMBER;
      // REPLACE ==============================================

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
        to: toNumber,
      });

      console.log("===============================================");
      console.log(`message: ${message}`);
      console.log(`from: ${fromNumber}`);
      console.log(`to: ${toNumber}`);
      console.log("===============================================");

      console.log(
        `SMS sent to ${params.customerPhone} with SID: ${result.sid}`
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
