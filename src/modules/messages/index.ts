import { EventsApp, EventsWhatsapp, Module as ModuleType } from "@types";
import { Message } from "./core/Message";
import Repository from "./infra/repository";
import { configs } from "@config/index";
import {
  Client,
  LocalAuth,
  Message as msg,
  MessageContent,
  MessageMedia,
  MessageSendOptions,
} from "whatsapp-web.js";
import { Messages } from "@prisma/client";

// app.on("ready", async () => {
//   const chats: any[] = await app.getChats();
//   for (const chat of chats) {
//     if (chat.isGroup) {
//       try {
//         const nameGroup = (chat.name || "").replace("/", "-");
//         fs.appendFileSync(
//           `out/${nameGroup}.csv`,
//           `${new Date().toISOString()}\n`
//         );
//         const participants = await chat.participants;
//         for (const participant of participants) {
//           const { id, number, name, pushname } = await app.getContactById(
//             participant.id._serialized
//           );
//           const log = `${number},${name},${pushname},${id._serialized}\n`;
//           fs.appendFileSync(`out/${nameGroup}.csv`, log);
//         }
//       } catch (e) {
//         console.log(`Erro READY log participantes grupos ${chat.name}:`, e);
//       }
//     }
//   }
// });

// /**
//  * groupLeave: O usuário saiu ou foi expulso do grupo
//  * @param {notification} notification Notification whatsapp
//  */
// async function subscribe(notification: any) {
//   const { name: chatName } = await notification.getChat();
//   const contact = await notification.getContact();
//   const type = notification.type === "add" ? "➕ 📲" : "➖ 📵";

//   const convidado = await app.getContactById(notification.id.participant);
//   // api.sendToAPI(
//   //   `${type} ${
//   //     convidado.name ||
//   //     convidado.pushname ||
//   //     convidado.id ||
//   //     notification.id.participant
//   //   } grupo ${chatName} por 🙋‍♂️ ${contact.name || contact.pushname}!`
//   // );
// }

// app.on("group_join", subscribe);
// app.on("group_leave", subscribe);

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const messages = new Repository([]);

    const whatsapp = new Client({
      authStrategy: new LocalAuth({
        clientId: configs.WHATSAPP.clientId,
      }),
      puppeteer: configs.WHATSAPP.puppeteer,
    });

    whatsapp.initialize();

    whatsapp.on(EventsWhatsapp.MESSAGE_CREATE, async (msg) => {
      if (msg.body.startsWith("🤖:")) return;
      const payload = <Messages>{
        from: msg.from,
        to: msg.to,
        body: msg.body,
        type: msg.type,
        hasMedia: msg.hasMedia,
      };
      if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        payload.data = media.data;
        payload.mimetype = media.mimetype || "";
      }
      const message = Message.create(payload);
      messages.add(message);
      app.emit(EventsWhatsapp.MESSAGE_CREATE, message);
    });

    whatsapp.on(
      EventsWhatsapp.LOADING_SCREEN,
      (percent: String, message: String) => {
        console.log("WHATSAPP: LOADING SCREEN", percent, message);
      }
    );

    whatsapp.on(EventsWhatsapp.DISCONNECTED, (reason) => {
      console.log("disconnected");
    });

    whatsapp.on(EventsWhatsapp.STATE_CHANGED, (reason) => {
      console.log("Client was logged out.", reason);
    });

    whatsapp.on(EventsWhatsapp.QR_RECEIVED, (qr) => {
      app.emit(EventsWhatsapp.QR_RECEIVED, qr);
    });

    whatsapp.on(EventsWhatsapp.READY, () => {
      app.emit(EventsApp.SEND_API, "Iniciado com sucesso!");
    });

    app.on(EventsApp.SEND_API, (content) => {
      whatsapp.sendMessage(configs.WHATSAPP.ID_API, `🤖: ${content}`);
    });

    return true;
  },
};
