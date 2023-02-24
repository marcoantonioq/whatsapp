import { EventsApp } from "@types";
import { Message, InterfaceRepository } from "../core/Message";
import settings from "@config/index";

import * as wppconnect from "@wppconnect-team/wppconnect";
import { Messages } from "@prisma/client";

export enum EventsWhatsapp {
  AUTHENTICATED = "authenticated",
  AUTHENTICATION_FAILURE = "auth_failure",
  READY = "ready",
  MESSAGE_RECEIVED = "message",
  MESSAGE_CREATE = "message_create",
  MESSAGE_REVOKED_EVERYONE = "message_revoke_everyone",
  MESSAGE_REVOKED_ME = "message_revoke_me",
  MESSAGE_ACK = "message_ack",
  MEDIA_UPLOADED = "media_uploaded",
  GROUP_JOIN = "group_join",
  GROUP_LEAVE = "group_leave",
  GROUP_UPDATE = "group_update",
  QR_RECEIVED = "qr",
  LOADING_SCREEN = "loading_screen",
  DISCONNECTED = "disconnected",
  STATE_CHANGED = "change_state",
  BATTERY_CHANGED = "change_battery",
  REMOTE_SESSION_SAVED = "remote_session_saved",
  CALL = "call",
}

export class Repository implements InterfaceRepository {
  private whatsapp!: wppconnect.Whatsapp;
  constructor(
    private readonly data: Message[],
    private readonly app: import("events")
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
          console.log("Novo qrCode::", urlCode);
          app.emit(EventsApp.QR_RECEIVED, urlCode);
        },
        statusFind: (statusSession: string, session: string) => {
          app.emit(EventsApp.STATUS, statusSession, session);
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
        await this.initialize();
        this.app.emit(EventsApp.READY);
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

  async deleteMessage(chatID: string, messageID: string): Promise<Boolean> {
    return await this.whatsapp.deleteMessage(chatID, messageID);
  }
  async forwardMessages(to: string, ids: string[], skipMyMessages = false) {
    await this.whatsapp.forwardMessages(to, ids, skipMyMessages);
    return true;
  }
  async initialize() {
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
      this.app.emit(EventsApp.MESSAGE_CREATE, message);
    });
  }
  async clearChat(chatID: string) {
    return this.whatsapp.clearChat(chatID);
  }
}

export default Repository;
