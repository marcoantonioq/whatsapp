import configs from "@config/index";
import { EventsApp, EventsWhatsapp, Module as ModuleType } from "@types";
import GetText from "./app/text";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    app.on(EventsWhatsapp.MESSAGE_CREATE, async (msg) => {
      if (msg.body.startsWith("🤖:") || msg.to !== configs.WHATSAPP.GROUP_API)
        return;

      const result = await new GetText().execute(msg.body);

      if (result) app.emit(EventsApp.SEND_API, `OpenAI: ${result}`);
    });

    return true;
  },
};

export default module;
