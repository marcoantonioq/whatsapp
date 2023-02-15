// https://docs.orkestral.io/venom/#/
import { EventsApp, EventsWhatsapp, Module as ModuleType } from "@types";
import { Message } from "./core/Message";
import Repository from "./infra/repository";
import { configs } from "@config/index";

import { Messages } from "@prisma/client";

import * as venom from "venom-bot";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const messages = new Repository([]);

    venom
      .create(
        "marco",
        (_base64Qrimg, asciiQR, _attempts, urlCode) => {
          app.emit(EventsWhatsapp.QR_RECEIVED, urlCode);
          // console.log("Terminal qrcode:\n ", asciiQR);
        },
        (statusSession, session) => {
          console.log("Status Session: ", statusSession);
          console.log("Session name: ", session);
          app.emit(EventsApp.SEND_API, statusSession);
        },
        {
          autoClose: 30000,
          folderNameToken: "tokens",
          mkdirFolderToken: "./out",
        }
      )
      .then(async (client) => {
        client.onMessage((msg) => {
          console.log("Nova mensagem recebida:::", msg);
        });
        client.onAnyMessage((msg) => {
          if (msg.body.startsWith("🤖:")) return;
          const contact = msg.chat.contact;
          const payload = <Messages>{
            id: msg.id,
            from: msg.from,
            to: msg.to,
            body: msg.body,
            type: msg.type,
            hasMedia: msg.isMedia,
            displayName: contact.name || contact.pushname,
            notifyName: msg.notifyName,
          };
          if (msg.isMedia) {
            payload.body = "";
            payload.caption = msg.caption;
            payload.data = msg.body;
            payload.mimetype = msg.mimetype;
          }
          const message = Message.create(payload);
          console.log("nova mensagem:::", message);
          messages.add(message);
          app.emit(EventsWhatsapp.MESSAGE_CREATE, message);
        });

        app.on(EventsApp.SEND_API, (content) => {
          client.sendText(configs.WHATSAPP.ID_API, `🤖: ${content}`);
        });
      });
    return true;
  },
};
