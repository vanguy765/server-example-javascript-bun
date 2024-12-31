// @ts-ignore
// src/api/testEndpoint.ts

import { Hono } from "hono";
import { Bindings } from "./types/hono.types";




const app = new Hono<{ Bindings: Bindings }>();

// console.log("ENTRY src/api/testEndpoint.ts");


app.get("/", (c) => {
  console.log(`(TESTING src/api/testEndpoint.ts) GET Hello World!`);
  console.log("Query Parameters:", c.req.query());
  return c.text("GET Hello World!");
});

app.post("/", async (c) => {
  console.log(`(TESTING src/api/testEndpoint.ts) POST Hello World!`);
  const body = await c.req.json();
  console.log("Request Body testEndpoint :", body);
  console.log("END testEndpoint");
  return c.text("POST Hello World!");
});

export { app as formsTestRoute };