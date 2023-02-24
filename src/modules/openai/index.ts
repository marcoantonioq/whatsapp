import configs from "@config/index";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, Module as ModuleType } from "@types";
import GetText from "./app/text";
import { Repository } from "./infra/repo";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    const repo = new Repository([]);
    app.on(EventsApp.MESSAGE_CREATE, async (msg) => {
      if (
        (msg.body && msg.body.startsWith("🤖:")) ||
        msg.to !== configs.WHATSAPP.GROUP_API
      )
        return;

      const result = await new GetText(repo).execute({
        to: msg.to,
        from: msg.from,
        body: msg.body,
        type: "text",
      });

      if (result.result) {
        app.emit(
          EventsApp.MESSAGE_SEND,
          Message.create({
            to: configs.WHATSAPP.GROUP_API,
            body: `OpenIA: \n${result.result}`,
          })
        );
      }
      console.log("Dialogs::::", await repo.dialogs());
    });

    return true;
  },
};

export default module;
