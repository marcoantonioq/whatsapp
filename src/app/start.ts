import configs from "@config/index";
import { Sends } from "./entity/Sends";
import { contatos, messages, saveQrCodeToSheet, sendTextAPI } from "./actions";
import { menuAPI } from "./Menus";

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
    saveQrCodeToSheet(qr);
  });

  /**
   * Novas mensagens Grupo API
   */
  let api_lock = false;
  messages.onMessageNew(async (msg) => {
    if (api_lock || msg.isBot || msg.to !== G_API) return;
    try {
      api_lock = true;
      if (msg.body) {
        const result = await menuAPI.selectOption(msg.body);
        if (result) {
          sendTextAPI(result);
        } else {
          sendTextAPI(`Menu: \n${await menuAPI.menu()}`);
        }
      }
    } catch (e) {
    } finally {
      api_lock = false;
    }
  });

  /**
   * Grupo SENDS
   */
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
