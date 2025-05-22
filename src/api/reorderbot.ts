import { Hono } from "hono";
import { envConfig } from "../config/env.config";
import { Bindings } from "../types/hono.types";

const app = new Hono<{ Bindings: Bindings }>();

// const tot_phoneNumberId = "800187f4-d205-401b-a90e-82dba423e4a1";
// const tot_assistantId = "610de396-8aec-48ff-88a5-e8cb73bfd1eb";
// const tot_customerNumber = "+17787754146";

app.post("/", async (c) => {
  // Extract phoneNumberId, assistantId, and customerNumber from the request body
  const { phoneNumberId, assistantId, customerNumber } = await c.req.json();

  console.log(
    `Received request to place outbound call with 
    phoneNumberId: ${phoneNumberId}, 
    assistantId: ${assistantId}, 
    customerNumber: ${customerNumber}`
  );

  try {
    /**!SECTION
     * Handle Outbound Call logic here.
     * This can initiate an outbound call to a customer's phonenumber using Vapi.
     */

    const response = await fetch(`${envConfig.vapi.baseUrl}/call/phone`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${envConfig.vapi.apiKey}`,
      },
      body: JSON.stringify({
        phoneNumberId: phoneNumberId,
        assistantId: assistantId,
        customer: {
          number: customerNumber,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return c.json(data, 200);
  } catch (error: any) {
    return c.json(
      {
        message: "Failed to place outbound call",
        error: error.message,
      },
      500
    );
  }
});

export { app as reorderbotRoute };
