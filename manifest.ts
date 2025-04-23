import { Manifest } from "deno-slack-sdk/mod.ts";
import WebhookWorkflow from "./workflows/webhook_workflow.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "BizOps - Integrations",
  description: "Integraciones de BizOps",
  icon: "assets/biz-ops-icon.png",
  workflows: [WebhookWorkflow],
  outgoingDomains: [
    "n8n.agendapro-bizops.com",
    "n8n-staging.agendapro-devops.com",
  ],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
