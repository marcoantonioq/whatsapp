import configs from "@config/index";
import { EventsApp, EventsWhatsapp, Module as ModuleType } from "@types";
import { auth, text } from "./core/WriteSonic";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    app.on(EventsWhatsapp.MESSAGE_CREATE, async (msg) => {
      if (configs.WRITESONIC.KEY && msg.body) {
        auth(configs.WRITESONIC.KEY);
        if (msg.body.startsWith("🤖:") || msg.to !== configs.WHATSAPP.GROUP_API)
          return;

        const result = await text(msg.body);
        console.log("Resulto writeSonic::::", result.data);
        if (result)
          app.emit(EventsApp.SEND_API, `SONIC: ${result.data.message}`);
      }
    });

    return true;
  },
};

export default module;
