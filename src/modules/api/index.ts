// https://docs.orkestral.io/venom/#/
import configs from "@config/index";
import { EventsApp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    app.on(EventsApp.MESSAGE_CREATE, async (msg) => {
      if (msg.to === configs.WHATSAPP.GROUP_SEND) {
        app.emit(EventsApp.FORWARD_MESSAGES, configs.WHATSAPP.MY_NUMBER, [msg]);
      }
    });
    return true;
  },
};
