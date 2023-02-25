import ModuleMessages from "@modules/messages";
import { ModuleGoogle } from "@modules/google";
import configs from "@config/index";
import { Message } from "@modules/messages/core/Message";

export const messages = ModuleMessages.create();
export const google = ModuleGoogle.create();

messages.onQR((qr) => {
  google.sheet.saveValues({
    spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
    values: [
      [
        `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`,
      ],
      [new Date().toLocaleString()],
    ],
    range: "Whatsapp!A2:A3",
  });
});

messages.onMessageNew(async (msg) => {
  console.log("Nova mensagem:::", msg);
  if (
    (msg.body && msg.body.startsWith("🤖:")) ||
    msg.to !== configs.WHATSAPP.GROUP_API
  )
    return;

  if (!msg.body) return;

  if (msg.body.split(" ").length > 1 && msg.body.match(/\?$/gi)) {
    const search = await google.search.text(msg.body);
    if (search)
      messages.sendMessage(
        Message.create({
          to: configs.WHATSAPP.GROUP_API,
          body: `Google: ${search}`,
        })
      );
  }

  // const transcription = await google.speech.oggToText(msg.body);
  // if (transcription)
  //   messages.sendMessage(
  //     Message.create({
  //       to: configs.WHATSAPP.GROUP_API,
  //       body: `Olá, sou um assistente. Entendi: \n\n"${transcription}"\n\nIsso mesmo? `,
  //     })
  //   );
});

// import { module as Shell } from "@modules/shell";
// import { module as Contatos } from "@modules/contacts";
// // import { module as Messages } from "@modules/messages";
// import { module as OpenAI } from "@modules/openai";
// import { module as Sonic } from "@modules/writesonic";
// import { module as SEND } from "@modules/send";
// import { Contact } from "@modules/contacts/core/Contacts";
// import { InterfaceRepository, Message } from "@modules/messages/core/Message";
// // app.add(Messages);
// app.add(Shell);
// app.add(Google);
// app.add(Contatos);
// app.add(OpenAI);
// app.add(Sonic);
// app.add(SEND);
