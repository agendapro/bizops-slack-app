import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { WebhookFunctionDefinition } from "../functions/webhook_function.ts";

const WebhookWorkflowDefinition = DefineWorkflow({
  callback_id: "webhook_workflow",
  title: "Webhook",
  description: "Agregar conexión con webhook",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity"],
  },
});

const inputForm = WebhookWorkflowDefinition.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Webhook",
    interactivity: WebhookWorkflowDefinition.inputs.interactivity,
    submit_label: "Formulario para el workflow",
    fields: {
      elements: [{
        name: "webhook",
        title: "Webhook title",
        type: Schema.types.string,
      }, {
        name: "method",
        title: "Method to fetch",
        type: Schema.types.string,
      }, {
        name: "body",
        title: "Body title",
        type: Schema.types.string,
        long: true,
      }],
      required: ["webhook", "method", "body"],
    },
  },
);

WebhookWorkflowDefinition.addStep(
  WebhookFunctionDefinition,
  {
    webhook: inputForm.outputs.fields.webhook,
    method: inputForm.outputs.fields.method,
    body: inputForm.outputs.fields.body,
  },
);

export default WebhookWorkflowDefinition;
