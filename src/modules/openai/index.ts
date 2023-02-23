import configs from "@config/index";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, Module as ModuleType } from "@types";
import GetText from "./app/text";

const { GROUP_API, GROUP_SEND, GROUP_NOTE, MY_NUMBER } = configs.WHATSAPP;

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    app.on(EventsApp.MESSAGE_CREATE, async (msg) => {
      if ((msg.body && msg.body.startsWith("🤖:")) || msg.to !== GROUP_API)
        return;

      const result = await new GetText().execute(msg.body);

      if (result) {
        app.emit(
          EventsApp.MESSAGE_SEND,
          Message.create({
            to: configs.WHATSAPP.GROUP_API,
            body: `OpenIA: \n${result}`,
          })
        );
      }
    });

    return true;
  },
};

export default module;
