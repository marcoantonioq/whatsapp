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

async function init() {
  const contacts = await contatos.getGoogleSheetToRepo();

  messages.onReady(async () => {
    // Novo contato recebido e whatsapp start
    contatos.onCreate(async (contact) => {
      const numbers = contact.telefones
        .split(",")
        .map((number) => `55${number}@c.us`);
      for (const number of numbers) {
        const { pushname, shortName, isMyContact, isUser } =
          await messages.getContact(number);
        if (isMyContact && shortName) {
          contact.nome = shortName;
        } else if (pushname) {
          contact.nome = pushname;
        }
      }
    });
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
        messages.sendMessage({
          to: configs.WHATSAPP.GROUP_API,
          body: `Google: ${search}`,
        });
    }

    // const transcription = await google.speech.oggToText(msg.body);
    // if (transcription)
    //   messages.sendMessage({
    //     to: configs.WHATSAPP.GROUP_API,
    //     body: `Olá, sou um assistente. Entendi: \n\n"${transcription}"\n\nIsso mesmo? `,
    //   });

    const result = await openAI.text({
      to: msg.to,
      from: msg.from || "",
      body: msg.body || "",
      type: "text",
    });

    if (msg.body.split(" ").length > 1 && result.result) {
      messages.sendMessage({
        to: configs.WHATSAPP.GROUP_API,
        body: `OpenIA: \n${result.result}`,
      });
    }
  });

  const sends = Sends.create({
    contatos: contatos,
  });

  messages.onMessageNew(async (msg) => {
    if (!msg.isBot && msg.to === G_SEND) {
      const result = await sends.toAnalyzeAddNumber(msg.body || "");

      const sendText = (text: string) => {
        messages.sendMessage({
          to: G_SEND,
          body: text,
        });
      };

      switch (result.action) {
        case "Enviando mensagens!":
          sendText(result.action);
          const { messagesID, numbers, cancel } = sends;
          for (const number of numbers) {
            if (cancel) break;
            const payload = {
              number,
              messagesID,
            };
            await messages.forwardMessages(payload);
          }
          sends.reset();
          sendText("Todas mensagens enviadas!");
          break;
        case "Ok, operação cancelada!":
          sends.cancel = true;
          sends.reset();
          break;
        case "Ok, informe as mensagens para envio!":
          sendText(result.action);
          break;
        case "Novos números!":
          sendText(result.msg);
          break;
        case "Números!":
          sendText(result.numbers.join(", "));
          break;
        case "Mensagem registrada!":
          sends.addMsg(msg.id);
          sendText(result.action);
          break;
        default:
          sendText(sends.groups);
          break;
      }
    }
  });
  console.log("::: Módulos iniciados!");
}

init().then(async () => {
  const start = await messages.initialize();
  if (start) {
    console.log("::: Whatsapp iniciado!");
  } else {
    console.log("::: Whatsapp não iniciado!");
  }
});
