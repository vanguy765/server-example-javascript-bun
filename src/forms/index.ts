// src/forms/index.ts

import { Hono } from "hono";
import { cellphoneFormHTML } from "./cellphone";
import { Bindings } from "../types/hono.types";

const app = new Hono<{ Bindings: Bindings }>();

console.log("ENTRY src/forms/index.ts");

// Middleware to log every request
app.use("*", async (c, next) => {
  console.log(`>>> Request at src/forms/index.ts: ${c.req.method} ${c.req.url}`);
//   const body = await c.req.json();
//   console.log("Middleware check body...:", body);
  await next();
});

//============================================================================
// Serve the form
app.get("/", (c) => {
  return c.html(cellphoneFormHTML);
});

//============================================================================
app.post("/", async (c) => {
    console.log(`(TESTING 14256) POST Hello World!`);
    const body = await c.req.json();
    console.log("Request Body 14256:", body);
    return c.text("(TESTING 14256) POST Hello World!");
  });


//============================================================================
// Handle 'Cell Phone Number Submission' form submission
// from src/forms/cellphone.ts
app.post("/submit", async (c) => {
  const body = await c.req.json();
  const phoneNumber = body.phoneNumber;
  const customerNumber = `+1${phoneNumber}`;

  const real_formCellPhoneNumberSubmission = "http://localhost:3000/api/outbound";
  const test_formCellPhoneNumberSubmission = "http://localhost:3000/api/testEndpoint";
  const endpoint_formCellPhoneNumberSubmission = real_formCellPhoneNumberSubmission;

  console.log("Phone Number:", phoneNumber);
  console.log("customerNumber:", customerNumber);
  console.log("Endpoint:", endpoint_formCellPhoneNumberSubmission);



  // Wait for 5 seconds
  // await new Promise(resolve => setTimeout(resolve, 5000));


  
  // Send POST request to another service
  try {
        const response = await fetch(endpoint_formCellPhoneNumberSubmission, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },        
        body: JSON.stringify({ customerNumber: customerNumber }),
        });
        
        if (!response.ok) {
            return c.json({ success: false, error: 'Failed to forward request' }, 500);
        }

        const data = await response.json();
        console.log(data);
        return c.json({ success: true });


  } catch (error) {
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});



export { app as formsRoute };