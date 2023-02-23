// https://docs.orkestral.io/venom/#/
import configs from "@config/index";
import { formatWhatsapp } from "@libs/phone";
import { Repository } from "@modules/contacts/infra/repository";
import { Message } from "@modules/messages/core/Message";
import { EventsApp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const phones: string[] = [];
    const contatos = new Repository([]);
    app.on(EventsApp.MESSAGE_CREATE, async (msg: Message) => {
      if (msg.to === configs.WHATSAPP.GROUP_SEND) {
        if (
          msg.body?.match(/(^add|^\/add)/gi) &&
          msg.body.match(/(\d{4}-\d{4}|\d{8})+/gi)
        ) {
          console.log("Add telefone!!!", [
            ...new Set([
              ...msg.body
                .split(/(\n|\r|\t|,|;|\|)/gi)
                .map((el) => el.replace(/\D/gim, ""))
                .filter((el) => el.match(/(\d{8})+/gi))
                .map(formatWhatsapp)
                .filter((el) => el && el !== "")
                .map((el) => String(el)),
            ]),
          ]);
        } else {
          app.emit(EventsApp.FORWARD_MESSAGES, configs.WHATSAPP.MY_NUMBER, [
            msg,
          ]);
        }
      }
    });
    return true;
  },
};
