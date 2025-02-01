// demo/src/forms/agentHandlers/transientHandler.ts

import { RequestContext } from "hono";
import { Bindings } from "../../types/hono.types";
import { envConfig } from "../../config/env.config";
import {
  createVapiSysPromptPlus,
  updateAssistantOverridesObject,
} from "../utils"; // Assuming these are in utils.ts

const local_outboundTransient = envConfig.endpoint.local_outboundTransient;

export const handleTransientAgent = async (
  c: RequestContext<{ Bindings: Bindings }>
) => {
  console.log("=================================");
  console.log("switch: transient");
  console.log("=================================");
  const demo = true; //  Determine demo status dynamically if needed
  let AssistantOverridesTemplate: any = createVapiSysPromptPlus(demo);

  const body = await c.req.json();
  const customerPhoneNumber = `+1${body.toNumber}`;
  const companyPhoneNumber = `+1${body.fromNumber}`;

  updateAssistantOverridesObject(
    AssistantOverridesTemplate,
    companyPhoneNumber,
    customerPhoneNumber
  );

  console.log(
    "transient > AssistantOverridesTemplate: ",
    AssistantOverridesTemplate
  );
  console.log("local_outboundTransient:", local_outboundTransient);

  const responseTransient = await fetch(local_outboundTransient, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(AssistantOverridesTemplate),
  });

  const messageTransient =
    "Transient agent has been created and sent to /outbound/transient.";
  console.log(messageTransient);
  return c.json({ success: true, messageTransient });
};
