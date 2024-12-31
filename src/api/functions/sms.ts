// src/api/functions/sms.ts

// export async function sendSms(message: string, from: string, to: string) {
//   const sentMessage = await client.messages.create({
//     body: message,
//     from: from,
//     to: to,
//   });


  import { Hono } from "hono";
  import { sendSms, test_sendSms } from "../../functionsSms/sendSms";
  import { Bindings } from "../../types/hono.types";
  import { VapiPayload, VapiWebhookEnum } from "../../types/vapi.types";  

const smsHandler = new Hono<{ Bindings: Bindings }>();

// console.log("ENTRY src/api/functions/sms.ts smsHandler");

//=======================================================================
smsHandler.get("/", (c) => {
    console.log("GET src/api/functions/sms.ts base path. Hello World!");
    return c.text("GET src/api/functions/sms.ts base path. Hello World!");
  });

//=======================================================================
smsHandler.post("/", async (c) => {    
    console.log("POST src/api/functions/sms.ts base path.");
    const parameters = {
        "message": "POST src/api/functions/sms.ts base path.",
        "from": "+16042106553",
        "to": "+17787754146",
      };

    //const result = await test_sendSms();
    const result = await sendSms(parameters.message, parameters.from, parameters.to);

    if (result === undefined) {
        return c.json({ error: "No result from root sendSms/" }, 500);
    }

    return c.json(result, 201);
});

//=======================================================================
smsHandler.post("/test_sendsms", async (c) => {
    console.log("POST src/api/functions/sms.ts basepath/test_sendsms.");
    const parameters = {
        "message": "POST src/api/functions/sms.ts basepath/test_sendsms.",
        "from": "+16042106553",
        "to": "+17787754146",
      };

    //const result = await test_sendSms();
    const result = await sendSms(parameters.message, parameters.from, parameters.to);

    if (result === undefined) {
        return c.json({ error: "No result from function sendSms/test_sendsms" }, 500);
    }

    return c.json(result, 201);
});

//=======================================================================
smsHandler.post("/sendsms", async (c) => {


    console.log("VapiPayload POST src/api/functions/sms.ts sendSms/sendsms.");

  try {
    const reqBody: any = await c.req.json();
    // console.log("reqBody", reqBody);

    const payload: VapiPayload = reqBody.message;
    // console.log("payload.toolCalls[0].function.name", payload.toolCalls[0].function.name);
    // console.log("payload.type", payload.type);

    //if (payload.type === VapiWebhookEnum.FUNCTION_CALL) {
    if (payload.type === "tool-calls") {
        // console.log("Here1 ");
      const functionCall = payload.toolCalls[0].function;

      // console.log("Here2 ", functionCall);

      if (!functionCall) {
        console.log("no functionCall");
        return c.json({ error: "Invalid Request." }, 400);
      }

      const parameter = functionCall.arguments;
      const name = functionCall.name;

      if (name === "sendSms") {
        
        // const customerName = parameter.from; // Replace with actual customer name from your data
        // const lastOrderDate = parameter.from; // Replace with actual last order date from your data
        const to = parameter.to;
        const from = parameter.from;
        const message = parameter.message;
        const toolCallId = payload.toolCalls[0].id;

        console.log("functionCall", functionCall);
        console.log("toolCallId", toolCallId);
        console.log("message", message);
        console.log("name", name);
        console.log("from", from);
        console.log("to", to);

        const result = await sendSms(message, from, to); 

        return c.json(result, 201);
      } else {
        console.log(`Function ${name} not found`);
        return c.json({ error: `Function ${name} not found` }, 404);
      }
    }

  


    return c.json({}, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});

export { smsHandler };
