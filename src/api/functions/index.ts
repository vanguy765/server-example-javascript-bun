import { Hono } from "hono";
import { Bindings } from "../../types/hono.types";
import { basicHandler } from "./basic";
import { ragHandler } from "./rag";
import { smsHandler } from "./sms";

const app = new Hono<{ Bindings: Bindings }>();

app.route("basic", basicHandler);
app.route("rag", ragHandler);
app.route("sms", smsHandler);

export { app as functionCallRoute };
