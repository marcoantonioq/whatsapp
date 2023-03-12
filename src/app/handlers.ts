import configs from "@config/index";
import { ModuleMessages } from "@modules/messages";
import { ModuleGoogle } from "@modules/google";
import { ModuleChatsAI } from "@modules/chats-ia";
import { ModuleContacts } from "@modules/contacts";
import { Chats } from "@modules/messages/core/Chats";
import { ModuleScrapy } from "@modules/scrappy";
import { format } from "@libs/phone";
import { Contact as ContactWhatsapp } from "@modules/messages/core/Message";
import { Contact } from "@modules/contacts/core/Contacts";

export const messages = ModuleMessages.create();
export const google = ModuleGoogle.create();
export const openAI = ModuleChatsAI.create("openAI");
export const writeSonic = ModuleChatsAI.create("writeSonic");
export const contatos = ModuleContacts.create();
export const chats = Chats.create(messages);
export const scrapy = ModuleScrapy.create();

/**
 * Mensagens Whatsapp iniciado!
 */
messages.onReady(async () => {
  contatos.onCreate(async (contact) => {});
  contatos.upGoogleSheetToContact();
});

messages.onQR((qr) => {
  saveQrCodeToSheet(qr);
});

export const questionAPI = async (text: string) =>
  await chats.question(text, configs.WHATSAPP.GROUP_API);

export async function sendTextAPI(body: string) {
  await messages.sendMessage({
    to: configs.WHATSAPP.GROUP_API,
    body,
  });
}

export async function sendImgToAPI(dataBase64: string, caption?: string) {
  await messages.sendMessage({
    to: configs.WHATSAPP.GROUP_API,
    data: dataBase64,
    type: "image",
    body: "Image.png",
    caption: caption || "Imagem",
  });
}

export function saveQrCodeToSheet(qr: string) {
  const generate = `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`;
  const payload = {
    spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
    values: [[generate], [new Date().toLocaleString()]],
    range: "Whatsapp!A2:A3",
  };
  google.sheet.saveValues(payload);
}

export async function transcreverAudio(mediaBase64: string) {
  return await google.speech.oggToText(mediaBase64);
}

export async function criarAviso(aviso: string) {
  const html = await scrapy.createPageTemplate("aviso", [
    [
      "content",
      aviso
        .trim()
        .split("\n")
        .map((el) => el.trim())
        .map((el, id) => (el.match(/^\</gi) && !id ? el : `<br>${el}</br>`))
        .join(""),
    ],
  ]);

  return await scrapy.printScreenPage(
    { templateHTML: html },
    "./out/image.png"
  );
}

export async function pesquisarGoogle(search: string) {
  return await google.search.text(search);
}

export async function pesquisarWriteSonic(search: string) {
  return await writeSonic.text({
    body: search,
    type: "text",
    to: "",
    from: "",
  });
}

export function removeDuplicates(strings: string[]): string[] {
  return [...new Set(strings)];
}

export async function extractNumber(numbers: string) {
  if (numbers.match(/(\d{4}-\d{4}|\d{8})+/gi)) {
    return numbers
      .split(/(\n|\r|\t|,|;)/gi)
      .map((el) => el.replace(/\D/gim, ""))
      .filter((el) => el.match(/(\d{8,13})+/gi))
      .map(format)
      .filter((el) => el !== "");
  }
  return [];
}

export async function contactWhatsappToContact(
  contact: ContactWhatsapp
): Promise<Contact | undefined> {
  if (contact) {
    return Contact.create({
      id: contact.id,
      nome: contact.shortName || contact.pushname || "",
      telefones: contact.id,
      isContact: contact.isMyContact,
      isWhatsapp: contact.isMyContact,
      isBusiness: contact.isBusiness,
      isUser: contact.isUser,
    });
  }
  return undefined;
}
