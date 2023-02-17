// https://docs.orkestral.io/venom/#/
import { EventsApp, EventsWhatsapp, Module as ModuleType } from "@types";
import { Message } from "./core/Message";
import Repository from "./infra/repository";
import { configs } from "@config/index";

import { Messages } from "@prisma/client";
import Whatsapp from "./core/Whatsapp";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const messages = new Repository([]);
    const whatsapp = await Whatsapp.create();

    /**
     * WHATSAPP => APP
     */
    // Status
    whatsapp.on(EventsWhatsapp.STATE_CHANGED, async (state: string) => {
      const disconnect = [
        "DISCONNECTED",
        "browserClose",
        "qrReadFail",
      ].includes(state);
      if (disconnect) {
        console.log("Disconnect: ", state);
      }
      app.emit(EventsApp.STATUS, state);
    });
    // Add Message Repository
    whatsapp.on(EventsWhatsapp.MESSAGE_CREATE, async (msg) => {
      messages.add(msg);
      app.emit(EventsApp.MESSAGE_CREATE, msg);
    });

    /**
     * APP => WHATSAPP
     */
    // messages
    app.on(EventsApp.MESSAGES, async (call) => {
      try {
        call(messages.messages);
      } catch (e) {
        console.log("Ger messages:::", e);
      }
      return messages.messages;
    });
    // Enviar mensagem para grupo API
    app.on(EventsApp.SEND_API, async (content) => {
      await whatsapp.sendText(configs.WHATSAPP.GROUP_API, `🤖: ${content}`);
    });
    // Encaminhar mensagens para o numero
    app.on(EventsApp.FORWARD_MESSAGES, async (to: string, msgs: any[]) => {
      await whatsapp.forwardMessages(to, msgs);
    });
    return true;
  },
};
