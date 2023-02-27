import configs from "@config/index";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, Module as ModuleType } from "@types";
import { auth, text } from "./core/WriteSonic";

export const module = <ModuleType>{
  async create(app: import("events")) {
    app.on(EventsApp.MESSAGE_CREATE, async (msg) => {
      try {
        if (configs.WRITESONIC.KEY && msg.body) {
          auth(configs.WRITESONIC.KEY);
          if (
            (msg.body && msg.body.startsWith("🤖:")) ||
            msg.to !== configs.WHATSAPP.GROUP_API
          )
            return;

          const result = await text(msg.body);
          console.log("WriteSonic::", msg.body, result);
          if (result)
            app.emit(
              EventsApp.MESSAGE_SEND,
              Message.create({
                to: configs.WHATSAPP.GROUP_API,
                body: `SONIC: ${result.data.message}`,
              })
            );
        }
      } catch (e) {}
    });

    return true;
  },
};

export default module;
