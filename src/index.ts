// src/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { customLLMRoute } from "./api/custom-llm";
import { functionCallRoute } from "./api/functions";
import { inboundRoute } from "./api/inbound";
import { outboundRoute } from "./api/outbound";
import { webhookRoute } from "./api/webhook";
import { formsRoute } from "./forms/index";
import { formsTestRoute } from "./api/testEndpoint";
import { Bindings } from "./types/hono.types";

// https://2371-172-103-252-213.ngrok-free.app/src/forms

const app = new Hono<{ Bindings: Bindings }>();

// Middleware to log every request
// app.use("*", async (c, next) => {
//   console.log("");
//   console.log(`> ./index.ts Request: ${c.req.method} ${c.req.url}`);
//   if (["POST", "PUT", "PATCH"].includes(c.req.method)) {
//     let body;
//     try {
//       const bodyText = await c.req.text();
//       if (bodyText) {
//         body = JSON.parse(bodyText);
//         console.log("indexMain Request Body:", body);
//       } else {
//         console.log("indexMain Request Body is empty");
//         app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));
//       }
//     } catch (error) {
//       console.log("Failed to parse JSON body:", error);
//     }
//   }
//   await next();
// });

app.use("*", prettyJSON());
app.use("*", cors());



app.get("/", (c) => {
  console.log(`(TESTING) GET Hello World!`);
  console.log("Query Parameters:", c.req.query());
  return c.text("GET Hello World!");
});

app.post("/", async (c) => {
  console.log(`(TESTING) POST Hello World!`);
  const body = await c.req.json();
  console.log("Request Body:", body);
  return c.text("POST Hello World!");
});

app.route("/forms/", formsRoute);
app.route("/api/testEndpoint", formsTestRoute);

app.route("/api/inbound", inboundRoute);
app.route("/api/outbound", outboundRoute);
app.route("/api/webhook", webhookRoute);

app.route("/api/functions", functionCallRoute);
app.route("/api/custom-llm", customLLMRoute);

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  fetch: app.fetch,
};
