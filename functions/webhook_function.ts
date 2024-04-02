import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

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
  ({ inputs }) => {
    const { webhook, method, body } = inputs as { webhook: string; method: string; body: string };

    const jsonBody = body.replace(/(\r\n|\n|\r)/gm, "").split("<{{,}}>").reduce((result, current) => {
      const [key, value] = current.split("<{{=}}>");
      
      if(key === undefined) return result;
      
      return {
        ...result,
        [key]: value,
      };
    }, {});

    if(method === "GET") {
      fetch(`${webhook}?${new URLSearchParams(jsonBody)}`);
    } else {
      fetch(webhook, {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonBody),
      });
    }

    return { outputs: { webhook, body } };
  },
);
