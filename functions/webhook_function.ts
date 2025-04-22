import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import { fetchToN8N } from "../utils/fetch.ts";
/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
// FORM
export const WebhookFunctionDefinition = DefineFunction({
  callback_id: "webhook_function",
  title: "Webhook",
  description: "Enviar fetch a un webhook",
  source_file: "functions/webhook_function.ts",
  input_parameters: {
    properties: {
      webhook: {
        type: Schema.types.string,
        description: "Webhook URL",
      },
      method: {
        type: Schema.types.string,
        description: "GET, POST, PUT, DELETE, etc.",
      },
      body: {
        type: Schema.types.string,
        description: "Body",
      },
    },
    required: ["webhook", "method", "body"],
  },
});

export default SlackFunction(
  WebhookFunctionDefinition,
  async ({ inputs }) => {
    const { webhook, method, body } = inputs as { webhook: string; method: string; body: string };

    fetchToN8N(webhook, method, body);

    return { outputs: { webhook, body } };
  },
);
