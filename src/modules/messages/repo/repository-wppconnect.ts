import { Message, InterfaceRepository } from "../core/Message";
import settings from "@config/index";

import * as wppconnect from "@wppconnect-team/wppconnect";
import { Messages } from "@prisma/client";

export class Repository implements InterfaceRepository {
  private whatsapp!: wppconnect.Whatsapp;
  constructor(
    private readonly data: Message[],
    readonly event: import("events")
  ) {
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
          const payload = <Messages>{
            id: msg.id,
            from: msg.from,
            to: msg.to,
            body: msg.body,
            type: msg.type,
            hasMedia: msg.isMedia,
            notifyName: msg.notifyName,
          };
          if (msg.isMedia) {
            payload.body = "";
            payload.caption = "";
            payload.mimetype = msg.mimetype;
          }
          const message = Message.create(payload);
          this.data.push(message);
          this.event.emit("message_create", message);
        });
        this.event.emit("ready", this.whatsapp);
      })
      .catch((error) => {
        console.log("Erro ao iniciar o whatsapp:::", error);
      });
  }
  async messages(): Promise<Message[]> {
    return this.data;
  }
  async send(msg: Message): Promise<Boolean> {
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
  }

  async delete(chatID: string, messageID: string): Promise<Boolean> {
    return await this.whatsapp.deleteMessage(chatID, messageID);
  }
  async forward(to: string, ids: string[], skipMyMessages = false) {
    await this.whatsapp.forwardMessages(to, ids, skipMyMessages);
    return true;
  }
  async clear(chatID: string) {
    return this.whatsapp.clearChat(chatID);
  }

  async contact(contactID: string) {
    const { name, id, isMyContact, isBusiness, shortName, pushname, labels } =
      await this.whatsapp.getContact(contactID);
    return {
      id,
      name,
      isMyContact,
      isBusiness,
      shortName,
      pushname,
      labels,
    };
  }
}

export default Repository;
