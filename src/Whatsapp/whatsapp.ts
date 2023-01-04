import { Client, LocalAuth, Message as msg } from "whatsapp-web.js";
import db from "../data";
import { formatWhatsapp } from "../phone";
import { Message } from "../Message";

export const app = new Client({
  authStrategy: new LocalAuth({
    // clientId: 'CAE',
    clientId: "MARCO",
  }),
  puppeteer: {
    executablePath: "/usr/bin/google-chrome-stable",
    // headless: false,
    args: [
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
  },
});

app.addListener("saveMessage", async (msg) => {
  return await db.messages.create({ data: msg });
});

app.initialize();

class API {
  private _locks: Array<string> = [];
  private _numbers: Array<string> = [];
  timeOut = [setTimeout(() => {}, 1000)];
  mensagens: Message[] = [];

  constructor() {}

  get locks() {
    return this._locks.length;
  }

  get numbers() {
    return this._numbers.join(", ");
  }

  set numbers(numbers: string) {
    const tmp = numbers
      .split(/(\n|,|;|\t)/gi)
      .map((el) => el.replace(/\D/gim, ""))
      .filter((el) => el && el !== "")
      .map((el) => {
        try {
          return formatWhatsapp(el);
        } catch (e) {
          return undefined;
        }
      })
      .filter((el) => el)
      .map((el) => String(el));
    const n1 = new Set([...this._numbers, ...tmp]);
    this._numbers = [...n1];
    this.timeOut.push(
      setTimeout(() => {
        if (!api.isEnable("send_citado")) {
          api.sendToAPI(
            `▶️ Enviaremos novas mensagens para: \n\n⏹️ Sair / Cancelar\n📤 Enviar / Ok\n\nNúmeros citados: ${api.numbersToString()}`
          );
          api.enable("send_citado");
        }
      }, 30000)
    );
    this.timeOut.push(
      setTimeout(() => {
        if (api.isEnable("send_citado")) {
          api.sendToAPI(`⏹️ Paramos encaminhar msg para os números citados!`);
          api.disable("send_citado");
          this.reset();
        }
      }, 15 * 60 * 1000)
    );
    api.sendToAPI(
      `🆗 Numeros registrados ${this.numbers}!!\n\nAguarde ⏱️... \n*Estamos preparando tudo*, em segundos iniciaremos...`,
      1000
    );
  }

  arrayNumbers() {
    return this._numbers.filter((el) => el);
  }

  numbersToString(delimitador = ", ") {
    return this._numbers
      .filter((el) => el)
      .map((el) => el.replace(/^55|@c.us$/gi, ""))
      .join(delimitador);
  }

  isToAPI(msg: msg) {
    return !msg.body.startsWith("🤖:") &&
      msg.fromMe &&
      msg.to === process.env.API_ID
      ? true
      : false;
  }

  isEnable(text: string) {
    return !!this._locks.find((el) => el === text);
  }

  enable(text: string) {
    this._locks.push(text);
    this._locks = [...new Set(this._locks)];
  }

  disable(text: string) {
    this._locks = this._locks.filter((el) => el !== text);
    this.timeOut.forEach((time) => clearTimeout(time));
  }

  async sendToAPI(text: string, delay: number = 0) {
    setTimeout(async () => {
      await app.sendMessage(String(process.env.API_ID), `🤖: ${text}`);
    }, delay);
  }

  async reset() {
    this._locks = [];
    this._numbers = [];
    this.mensagens = [];
    this.timeOut.forEach((time) => clearTimeout);
  }

  toString() {
    return this;
  }
}

export const api = new API();
