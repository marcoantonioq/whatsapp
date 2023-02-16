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
        (_base64Qrimg, _asciiQR, _attempts, urlCode) => {
          console.log("QrCode receved: ", urlCode);
          app.emit(EventsWhatsapp.QR_RECEIVED, urlCode);
        },
        (state) => {
          // app.emit(EventsWhatsapp.STATE_CHANGED, state);
        },
        {
          autoClose: 30000,
          folderNameToken: "tokens",
          mkdirFolderToken: "./out",
          disableWelcome: true,
          disableSpins: true,
          useChrome: true,
        }
      )
      .then(async (client) => {
        client.onAnyMessage(async (msg) => {
          // if ((msg.body && msg.body.startsWith("🤖:"))) return;
          const contact = msg.chat.contact;
          const payload = <Messages>{
            id: msg.id,
            from: msg.from,
            to: msg.to,
            body: msg.body,
            caption: msg.caption,
            type: msg.type,
            hasMedia: msg.isMedia,
            displayName: contact?.name || contact?.pushname,
            notifyName: msg.notifyName,
          };
          if (msg.isMedia) {
            payload.body = "";
            payload.mimetype = msg.mimetype;
          }
          const message = Message.create(payload);
          await messages.add(message);
          const tmp = await client.getMessageById(message.id);
          console.log("Nova mensagem:::", message);
          console.log(
            "Forwart:::",
            await client.forwardMessages(
              configs.WHATSAPP.MY_NUMBER,
              [tmp.id],
              true
            )
          );
          app.emit(EventsWhatsapp.MESSAGE_CREATE, message);
        });

        app.on(EventsApp.SEND_API, async (content) => {
          await client.sendText(configs.WHATSAPP.GROUP_API, `🤖: ${content}`);
        });

        app.on(EventsWhatsapp.DISCONNECTED, async (state) => {
          console.log("Restart whatsapp service!!!");
          // await client.restartService();
        });

        app.on(EventsWhatsapp.STATE_CHANGED, async (state: string) => {
          const disconnect = ["DISCONNECTED"].includes(state);
          console.log("STATE: ", state);
          if (disconnect) {
            app.emit(EventsWhatsapp.DISCONNECTED, state);
          }
        });

        client.onStreamChange((state: any) => {
          app.emit(EventsWhatsapp.STATE_CHANGED, state);
        });
      });
    return true;
  },
};
