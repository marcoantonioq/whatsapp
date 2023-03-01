import { Message, InterfaceRepository } from "../core/Message";
import settings from "@config/index";

import * as wppconnect from "@wppconnect-team/wppconnect";
import EventEmitter from "events";

export class RepositoryWPPConnect implements InterfaceRepository {
  private whatsapp!: wppconnect.Whatsapp;
  public readonly event = new EventEmitter();
  constructor(private readonly data: Message[]) {
    const event = this.event;
    wppconnect
      .create({
        session: settings.WHATSAPP.clientId,
        catchQR: async (
          _base64Qr: any,
          _asciiQR: any,
          _attempts: any,
          urlCode: any
        ) => {
          event.emit("qr", urlCode);
        },
        statusFind: (statusSession: string, session: string) => {
          event.emit("status", statusSession, session);
        },
        headless: true,
        devtools: false,
        useChrome: true,
        debug: false,
        logQR: true,
        browserWS: "",
        browserArgs: [
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
        puppeteerOptions: {
          executablePath: "/usr/bin/google-chrome-stable",
        },
        disableWelcome: true,
        updatesLog: false,
        autoClose: 0,
        tokenStore: "file",
        folderNameToken: "./out/tokens",
      })
      .then(async (client) => {
        this.whatsapp = client;
        this.whatsapp.onAnyMessage(async (msg) => {
          const payload = <Message>{
            id: msg.id,
            from: msg.from,
            to: msg.to,
            body: msg.body,
            type: msg.type,
            hasMedia: msg.isMedia,
            notifyName: msg.notifyName,
            isBot: false,
          };
          if (msg.isMedia) {
            payload.body = "";
            payload.caption = "";
            payload.mimetype = msg.mimetype;
          }
          const message = Message.create(payload);
          this.data.push(message);
          if (!message.isBot) {
            event.emit("message_create", message);
          }
        });
        event.emit("ready", this.whatsapp);
      })
      .catch((error) => {
        console.log("Erro ao iniciar o whatsapp:::", error);
      });
  }
  async forwardMessages(
    to: string,
    ids: string[],
    skipMyMessages: boolean = false
  ): Promise<boolean> {
    try {
      await this.whatsapp.forwardMessages(to, ids, skipMyMessages);
      return true;
    } catch (e) {
      console.log("Erro no encaminhamento::", e);
      return false;
    }
  }
  async messages(): Promise<Message[]> {
    return this.data;
  }
  async send(msg: Message): Promise<boolean> {
    try {
      switch (msg.type) {
        case "image":
          break;
        default:
          if (msg.body) {
            const result = await this.whatsapp.sendText(msg.to, msg.body);
            msg.id = result.id;
          }
          break;
      }
      return true;
    } catch (e) {
      console.log("Erro repo::", e);

      return false;
    }
  }

  async delete(chatID: string, messageID: string): Promise<boolean> {
    return await this.whatsapp.deleteMessage(chatID, messageID);
  }

  async clear(chatID: string) {
    return this.whatsapp.clearChat(chatID);
  }

  async contact(contactID: string) {
    const { name, id, isMyContact, isBusiness, shortName, pushname, labels } =
      await this.whatsapp.getContact(contactID);
    return {
      id: id._serialized,
      name,
      isMyContact,
      isBusiness,
      shortName,
      pushname,
      labels,
    };
  }
}
