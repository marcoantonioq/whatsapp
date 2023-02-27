import { ModuleMessages } from "@modules/messages";
import configs from "@config/index";
import { ModuleGoogle } from "@modules/google";
import { ModuleOpenAI } from "@modules/openai";
import { ModuleContacts } from "@modules/contacts";
import { Sends } from "src/entity/Sends";

export const messages = ModuleMessages.create();
export const google = ModuleGoogle.create();
export const openAI = ModuleOpenAI.create();
export const contatos = ModuleContacts.create();

const G_SEND = configs.WHATSAPP.GROUP_SEND;

contatos.update().then(async (contacts) => {
  console.log("Contatos::", (await contatos.contacts()).length);
});
/**
 * Salvar QRCode Google Sheet
 */
messages.onQR((qr) => {
  const generate = `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`;
  const payload = {
    spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
    values: [[generate], [new Date().toLocaleString()]],
    range: "Whatsapp!A2:A3",
  };
  google.sheet.saveValues(payload);
});

// messages.onMessageNew(async (msg) => {
//   console.log("Nova mensagem:::", msg);
//   if (
//     (msg.body && msg.body.startsWith("🤖:")) ||
//     msg.to !== configs.WHATSAPP.GROUP_API
//   )
//     return;

//   if (!msg.body) return;

//   if (msg.body.split(" ").length > 1 && msg.body.match(/\?$/gi)) {
//     const search = await google.search.text(msg.body);
//     if (search  msg.
//       messages.sendMessage(
//         Message.create({
//           to: configs.WHATSAPP.GROUP_API,
//           body: `Google: ${search}`,
//         })
//       );
//   }

//   // const transcription = await google.speech.oggToText(msg.body);
//   // if (transcription)
//   //   messages.sendMessage(
//   //     Message.create({
//   //       to: configs.WHATSAPP.GROUP_API,
//   //       body: `Olá, sou um assistente. Entendi: \n\n"${transcription}"\n\nIsso mesmo? `,
//   //     })
//   //   );

//   const result = await openAI.text({
//     to: msg.to,
//     from: msg.from || "",
//     body: msg.body || "",
//     type: "text",
//   });

//   if (msg.body.split(" ").length > 1 && result.result) {
//     messages.sendMessage(
//       Message.create({
//         to: configs.WHATSAPP.GROUP_API,
//         body: `OpenIA: \n${result.result}`,
//       })
//     );
//   }
// });

const sends = Sends.create({
  contatos: contatos,
});
messages.onMessageNew(async (msg) => {
  if (!msg.isBot && msg.to === G_SEND) {
    if (msg.body?.match(/^(iniciar|enviar)$/gi)) {
      try {
        for (const number of sends.numbers) {
          if (!sends.cancel) await messages.forwardMessage(number, sends.ids);
        }
      } catch (e) {
        console.log("Erro no envio: ", e);
      }
    } else if (!sends.loggingNewMessages && !msg.hasMedia && msg.body) {
      const result = await sends.toAnalyzeAddNumber(msg.body);
      if (result)
        messages.sendMessage({
          to: G_SEND,
          body: result.msg,
        });
    } else {
      sends.ids.push(msg.id);
      messages.sendMessage({
        to: G_SEND,
        body: "Mensagem registrada!",
      });
    }
  }
});
