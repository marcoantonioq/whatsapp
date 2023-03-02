import { ModuleMessages } from "@modules/messages";
import configs from "@config/index";
import { ModuleGoogle } from "@modules/google";
import { ModuleChatsAI } from "@modules/chats-ia";
import { ModuleContacts } from "@modules/contacts";
import { Sends } from "./entity/Sends";

export const messages = ModuleMessages.create();
export const google = ModuleGoogle.create();
export const openAI = ModuleChatsAI.create("openAI");
export const writeSonic = ModuleChatsAI.create("writeSonic");
export const contatos = ModuleContacts.create();

const G_SEND = configs.WHATSAPP.GROUP_SEND;

async function init() {
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
   * Novas mensagens
   */
  messages.onMessageNew(async (msg) => {
    if (
      (msg.body && msg.body.startsWith("🤖:")) ||
      msg.to !== configs.WHATSAPP.GROUP_API
    )
      return;

    new Promise(async (resolve) => {
      if (msg.type && msg.hasMedia && ["audio", "ptt"].includes(msg.type)) {
        const media = await messages.downloadMedia(msg.id);
        const transcription = await google.speech.oggToText(media.data);
        if (transcription) {
          messages.sendMessage({
            to: configs.WHATSAPP.GROUP_API,
            body: `Transcrição: \n\n"${transcription}"`,
          });
          resolve(transcription);
        }
      }
    });

    if (msg.body) {
      if (msg.body.split(" ").length > 1) {
        new Promise(async (resolve) => {
          if (msg.body && msg.body.match(/\?$/gi)) {
            const search = await google.search.text(msg.body);
            if (search) {
              messages.sendMessage({
                to: configs.WHATSAPP.GROUP_API,
                body: `Google: ${search}`,
              });
              resolve(search);
            }
          }
        });

        new Promise(async (resolve) => {
          const result = await writeSonic.text({
            to: msg.to,
            from: msg.from || "",
            body: msg.body || "",
            type: "text",
          });

          if (result.result) {
            messages.sendMessage({
              to: configs.WHATSAPP.GROUP_API,
              body: `WriteSonic: \n${result.result}`,
            });
          }
          resolve(result);
        });

        new Promise(async (resolve) => {
          const result = await openAI.text({
            to: msg.to,
            from: msg.from || "",
            body: msg.body || "",
            type: "text",
          });

          if (result.result) {
            messages.sendMessage({
              to: configs.WHATSAPP.GROUP_API,
              body: `OpenIA: \n${result.result}`,
            });
          }
          resolve(result);
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
    }
  });
}

init().then(async () => {
  console.log("::: Módulos iniciados!");
  if (await messages.initialize()) {
    console.log("::: Whatsapp iniciado!");
  } else {
    console.log("::: Whatsapp não iniciado!");
  }
});
