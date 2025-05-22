import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { customLLMRoute } from "./api/custom-llm";
import { functionCallRoute } from "./api/functions";
import { inboundRoute } from "./api/inbound";
import { outboundRoute } from "./api/outbound";
import { reorderbotRoute } from "./api/reorderbot";
import { webhookRoute } from "./api/webhook";
import { Bindings } from "./types/hono.types";
import { serveStatic } from "hono/serve-static";
import * as fs from "fs";
import * as path from "path";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", prettyJSON());
app.use("*", cors());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.get("/", (c) => {
  return c.text("Hello World!");
});

// Serve reorderbot.html
app.get("/reorderbot", async (c) => {
  try {
    console.log("GET request received for /reorderbot");

    const htmlPath = path.join(__dirname, "reorderbot.html");
    console.log(`Reading HTML file from: ${htmlPath}`);

    const html = fs.readFileSync(htmlPath, "utf8");
    console.log("HTML file successfully read");

    return c.html(html);
  } catch (error: any) {
    console.error("Error serving reorderbot.html:", error.message);
    return c.text(`Error serving HTML: ${error.message}`, 500);
  }
});

app.route("/api/inbound", inboundRoute);
app.route("/api/outbound", outboundRoute);
app.route("/api/reorderbot", reorderbotRoute);
app.route("/api/webhook", webhookRoute);

app.route("/api/functions", functionCallRoute);
app.route("/api/custom-llm", customLLMRoute);

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  fetch: app.fetch,
};
