import { ModuleMessages } from "@modules/messages";
import configs from "@config/index";
import { ModuleGoogle } from "@modules/google";
import { ModuleChatsAI } from "@modules/chats-ia";
import { ModuleContacts } from "@modules/contacts";
import { Sends } from "./entity/Sends";
import { Chats } from "@modules/messages/core/Chats";
import { ModuleScrapy } from "@modules/scrappy";

export const messages = ModuleMessages.create();
export const google = ModuleGoogle.create();
export const openAI = ModuleChatsAI.create("openAI");
export const writeSonic = ModuleChatsAI.create("writeSonic");
export const contatos = ModuleContacts.create();
export const chats = Chats.create(messages);
export const scrapy = ModuleScrapy.create();

const G_SEND = configs.WHATSAPP.GROUP_SEND;
const G_API = configs.WHATSAPP.GROUP_API;

export async function components() {
  await contatos.getGoogleSheetToRepo();
  contatos.onCreate(async (contact) => {
    console.log("Novos contato::", contact);
  });

  /**
   * Mensagens Whatsapp iniciado!
   */
  messages.onReady(async () => {});

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

  /**
   * Novas mensagens Grupo API
   */
  messages.onMessageNew(async (msg) => {
    if (msg.isBot || msg.to !== G_API) return;
    const question = await chats.createQuestion(G_API);

    if (msg.type && msg.hasMedia && ["audio", "ptt"].includes(msg.type)) {
      new Promise(async (resolve) => {
        const media = await messages.downloadMedia(msg.id);
        const transcription = await google.speech.oggToText(media.data);
        if (transcription) {
          messages.sendMessage({
            to: G_API,
            body: `Transcrição: \n\n"${transcription}"`,
          });
          resolve(transcription);
        }
      });
    } else if (msg.body?.match(/^(criar |)aviso/)) {
      new Promise(async (resolve) => {
        const aviso = await question("Informe o aviso que deseja: ");

        const html = await scrapy.createPageTemplate("aviso", [
          [
            "content",
            aviso
              .trim()
              .split("\n")
              .map((el) => el.trim())
              .map((el, id) =>
                el.match(/^\</gi) && !id ? el : `<br>${el}</br>`
              )
              .join(""),
          ],
        ]);

        const data = await scrapy.printScreenPage(
          { templateHTML: html },
          "./out/image.png"
        );
        const caption = await question("Informe o caption: ");
        await messages.sendMessage({
          to: G_API,
          data,
          type: "image",
          body: "Aviso.png",
          caption: caption || "Aviso",
        });
        resolve(true);
      });
    } else if (msg.body?.match(/^(google|pesquisar)$/gi)) {
      const search = await question("O que deseja pesquisar no google?");
      const result = await google.search.text(search || "");
      if (result) {
        messages.sendMessage({
          to: G_API,
          body: `Google: ${result}`,
        });
      }
    } else if (msg.body?.match(/^(write|chat)$/gi)) {
      const search = await question("O que deseja pesquisar no WriteSonic?");
      const result = await writeSonic.text({
        to: msg.to,
        from: msg.from || "",
        body: search || "",
        type: "text",
      });

      if (result.result) {
        messages.sendMessage({
          to: G_API,
          body: `WriteSonic: \n${result.result}`,
        });
      }
    } else if (msg.body?.match(/^(openia|openai|ia)$/gi)) {
      const search = await question("O que deseja pesquisar no OpenIA?");
      const result = await openAI.text({
        to: msg.to,
        from: msg.from || "",
        body: search || "",
        type: "text",
      });

      if (result.result) {
        messages.sendMessage({
          to: G_API,
          body: `OpenIA: \n${result.result}`,
        });
      }
    }
  });

  const sends = Sends.create({
    contatos: contatos,
  });
  sends.onCreateContact(async (contact) => {
    const wc = await messages.getContact(`55${contact.number}@c.us`);
    if (wc) {
      const payload = {
        id: wc.id,
        name: wc.shortName || wc.pushname || "",
        number: contact.number,
        isMyContact: wc.isMyContact,
        isWhatsapp: wc.isMyContact,
      };
      sends.contacts = [payload];
    }
  });

  messages.onMessageNew(async (msg) => {
    if (msg.isBot || msg.to !== G_SEND) return;
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
        for (const contact of sends.contacts) {
          if (sends.cancel) break;
          const payload = {
            number: contact.id || contact.number,
            messagesID: sends.messagesID,
          };
          await messages.forwardMessages(payload);
        }
        sends.reset();
        sendText("Todas mensagens enviadas!");
        break;
      case "Ok, operação cancelada!":
        sendText(result.action);
        sends.cancel = true;
        sends.reset();
        break;
      case "Ok, informe as mensagens para envio!":
        sendText(
          `Informe as mensagem de envio para contatos (enviar/sair): \n\n${sends.contactsToString()}`
        );
        sendText(result.action);
        break;
      case "Novos números!":
        sendText(result.msg);
        break;
      case "Lista de números:":
        sendText(sends.contactsToString());
        break;
      case "Mensagem registrada!":
        sends.addMsg(msg.id);
        sendText(result.action);
        break;
      default:
        sendText(sends.groups);
        break;
    }
  });
  return true;
}

export async function initialize() {
  await messages.initialize();
  return true;
}
