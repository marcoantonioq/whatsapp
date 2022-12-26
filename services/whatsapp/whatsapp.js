/**
 * TypeScript message
 * @typedef { import("whatsapp-web.js").Message } msg
 */

const { MessageMedia, Message } = require("whatsapp-web.js");
const whatsAppWeb = require("whatsapp-web.js");
const phone = require("../phone");
const db = require("../../data");

const app = new whatsAppWeb.Client({
  authStrategy: new whatsAppWeb.LocalAuth({
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

app.createSendMessage = async (msg) => {
  try {
    // console.log("Novo tipo de msg::: ", msg);
    if (msg.hasMedia) {
      const media = new MessageMedia(msg.mimetype, msg.data, msg.body);
      if (msg.type === "ptt") {
        await app.sendMessage(msg.to, media, {
          sendAudioAsVoice: true,
        });
      } else if (msg.type === "image") {
        await app.sendMessage(msg.to, media, {
          caption: msg.body,
        });
      } else {
        await app.sendMessage(msg.to, media);
      }
    } else {
      await app.sendMessage(msg.to, msg.body);
    }
    return true;
  } catch (e) {
    console.error("Error createMsgSend: ", e);
    return false;
  }
};

app.addListener("sendMessage", async (msg) => {
  const data = await db.Messages.create(msg);
  if (app.createSendMessage(msg)) {
    await data.destroy();
  }
});

app.on("ready", async () => {
  const msgs = await db.Messages.findAll({
    where: { group: "SEND", status: false },
  });
  for (const msg of msgs) {
    if (app.createSendMessage(msg.dataValues)) {
      msg.destroy();
    }
  }
});

app.initialize();

class API {
  constructor() {
    this.state = {
      locks: [],
      numbers: [],
    };
  }

  get numbers() {
    return this.state.numbers;
  }

  set numbers(numbers = "") {
    this.state.numbers = [
      ...new Set(
        numbers
          .split(/(\n|,|;| )/gi)
          .map((el) => phone.format(el))
          .filter((el) => el)
      ),
    ];
  }

  numbersToString(delimitador = ", ") {
    return this.numbers
      .map((el) => el.replace(/55|@c.us/gi, ""))
      .join(delimitador);
  }

  toAPI(msg) {
    return !msg.body.startsWith("API:") &&
      msg.fromMe &&
      msg.to === process.env.API_ID
      ? true
      : false;
  }

  isEnable(text) {
    return !!this.state.locks.find((el) => el === text);
  }

  enable(text) {
    this.state.locks.push(text);
    this.state.locks = [...new Set(this.state.locks)];
  }

  disable(text) {
    this.state.locks = this.state.locks.filter((el) => el !== text);
  }

  send(text) {
    app.sendMessage(process.env.API_ID, `API: ${text}`);
  }

  cmd() {}

  toString() {
    return this;
  }
}

module.exports = {
  app,
  whatsAppWeb,
  api: new API(),
};
