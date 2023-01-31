import * as dotenv from "dotenv";
import { Whatsapp } from "./libs/whatsapp";
import fs from "fs";
import { sheet } from "./modules/google/Sheet";
import * as shell from "@modules/shell/infra/services";
dotenv.config();

const app = Whatsapp.create({
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

app.initialize();

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

app.on("qr", async (qr) => {
  shell.qrCodeConsole.execute(qr);
  //   try {
  //     const plan = sheet.doc.sheetsByTitle.Whatsapp;
  //     await plan.loadCells("A1:A3");
  //     const A2 = plan.getCellByA1("A2");
  //     A2.value = `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`;
  //     A2.save();
  //     const A3 = plan.getCellByA1("A3");
  //     A3.value = `${new Date().toLocaleString()}`;
  //     A3.save();
  //   } catch (e) {
  //     const ms = `Erro saveQRCode: ${e}`;
  //     console.error(ms);
  //   }
});

app.on("disconnected", (reason) => {
  shell.rebootSystem.execute();
});

app.on("state_changed", (reason) => {
  console.log("Client was logged out.", reason);
});
