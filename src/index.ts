import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { customLLMRoute } from "./api/custom-llm";
import { functionCallRoute } from "./api/functions";
import { inboundRoute } from "./api/inbound";
import { outboundRoute } from "./api/outbound";
import { reorderbotRoute } from "./api/reorderbot_originalAdjusted";
import { tenantsRoute as supabaseRoute } from "./supabase";
import { webhookRoute } from "./api/webhook";
import { Bindings } from "./types/hono.types";

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", prettyJSON());
app.use("*", cors());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.get("/reorderbot", async (c) => {
  const html = await Bun.file("./src/reorderbot.html").text();
  return c.html(html);
});

app.route("/api/inbound", inboundRoute);
app.route("/api/outbound", outboundRoute);
app.route("/api/reorderbot", reorderbotRoute);
app.route("/api/webhook", webhookRoute);
app.route("/api/supabase/tenants", supabaseRoute);

app.route("/api/functions", functionCallRoute);
app.route("/api/custom-llm", customLLMRoute);

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  fetch: app.fetch,
};
