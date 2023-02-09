import * as dotenv from "dotenv";
import { App } from "../libs/whatsapp";
import { Module as Shell } from "@modules/shell";
import { Module as Contatos } from "@modules/contacts";
import { Module as Messages } from "@modules/messages";
dotenv.config();

const app = App.create({
  clientId: "MARCO",
  puppeteer: {
    executablePath: "/usr/bin/google-chrome-stable",
    args: [
      "--disable-default-apps",
      "--disable-extensions",
      "--disable-setuid-sandbox",
      "--enable-features=NetworkService",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--no-default-browser-check",
      "--no-experiments",
      "--no-sandbox",
      "--disable-3d-apis",
      "--disable-accelerated-2d-canvas",
      "--disable-accelerated-jpeg-decoding",
      "--disable-accelerated-mjpeg-decode",
      "--disable-accelerated-video-decode",
      "--disable-app-list-dismiss-on-blur",
      "--disable-canvas-aa",
      "--disable-composited-antialiasing",
      "--disable-gl-extensions",
      "--disable-gpu",
      "--disable-histogram-customizer",
      "--disable-in-process-stack-traces",
      "--disable-site-isolation-trials",
      "--disable-threaded-animation",
      "--disable-threaded-scrolling",
      "--disable-webgl",
    ],
  },
});
app.add(new Contatos());
app.add(new Messages());
app.add(new Shell());

app.whatsapp.initialize();

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

app.on("loading_screen", (percent: String, message: String) => {
  console.log("WHATSAPP: LOADING SCREEN", percent, message);
});

app.on("disconnected", (reason) => {
  console.log("disconnected");
});

app.on("state_changed", (reason) => {
  console.log("Client was logged out.", reason);
});

app.on("state_changed", (reason) => {
  console.log("Client was logged out.", reason);
});
