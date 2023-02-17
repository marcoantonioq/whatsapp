import { Messages } from "@prisma/client";
import { EventsApp, EventsWhatsapp } from "@types";

import * as wppconnect from "@wppconnect-team/wppconnect";
import EventEmitter from "events";
import { Message } from "./Message";

declare interface Whatsapp {
  on(
    event: EventsWhatsapp.MESSAGE_CREATE,
    listener: (name: Message) => void
  ): this;
  on(event: string, listener: Function): this;
}

class Whatsapp extends EventEmitter {
  private _client!: wppconnect.Whatsapp;
  private constructor() {
    super();
  }
  set client(client: wppconnect.Whatsapp) {
    this._client = client;
  }
  get client() {
    return this._client;
  }
  static create(settings = { session: "marco" }): Promise<Whatsapp> {
    const instance = new Whatsapp();
    return new Promise((resolve, reject) => {
      wppconnect
        .create({
          session: settings.session,
          catchQR: (
            _base64Qr: any,
            _asciiQR: any,
            _attempts: any,
            urlCode: any
          ) => {
            instance.sendQR(urlCode);
          },
          statusFind: (statusSession: any, session: any) => {
            instance.statusSession(statusSession, session);
            if (statusSession === "browserClose") {
              reject("Navegador fechado!!!");
            }
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
          updatesLog: true,
          autoClose: 0,
          tokenStore: "file",
          folderNameToken: "./out/tokens",
        })
        .then((client) => {
          instance.client = client;
          instance.initialize();
          resolve(instance);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  sendQR(qr: string) {
    this.emit(EventsWhatsapp.QR_RECEIVED, qr);
  }
  private statusSession(statusSession: any, session: any) {
    //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
    console.log("Status Session: ", statusSession);
    console.log("Session name: ", session);
    this.emit(EventsWhatsapp.STATE_CHANGED, statusSession);
  }

  async sendText(to: string, text: string) {
    await this.client.sendText(to, text);
  }

  async getMessageById(msg: Message) {
    return await this.client.getMessageById(msg.id);
  }

  async forwardMessages(to: string, msgs: Message[], skipMyMessages = false) {
    await this.client.forwardMessages(
      to,
      msgs.map((msg) => msg.id),
      skipMyMessages
    );
    return true;
  }
  private async initialize() {
    this.client.onAnyMessage(async (msg) => {
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
      this.emit(EventsWhatsapp.MESSAGE_CREATE, message);
    });
  }
}

export default Whatsapp;
