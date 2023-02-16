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
          console.log(asciiQR);
        },
        async (statusSession, session) => {
          switch (statusSession) {
            case "successChat":
              app.emit(EventsApp.SEND_API, statusSession);
              console.log("Status Session: ", statusSession);
              console.log("Session name: ", session);
              break;
            case "browserClose":
              app.emit(EventsWhatsapp.DISCONNECTED, statusSession);
              console.log("Status Session: ", statusSession);
              break;
            default:
              break;
          }
        },
        {
          autoClose: 50000,
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
          console.log("Nova mensagem:::", message);
          messages.add(message);
          const tmp = await client.getMessageById(message.id);
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

        app.on(EventsApp.SEND_API, (content) => {
          client.sendText(configs.WHATSAPP.GROUP_API, `🤖: ${content}`);
        });

        app.on(EventsWhatsapp.DISCONNECTED, async () => {
          await client.restartService();
        });
        app.on(EventsWhatsapp.BATTERY_CHANGED, async () => {
          console.log("Battery::: ", await client.getBatteryLevel());
        });
        app.emit(EventsWhatsapp.BATTERY_CHANGED);
      });
    return true;
  },
};
