/**
 * TypeScript message
 * @typedef { import("whatsapp-web.js").Message } msg
 */

const whatsAppWeb = require("whatsapp-web.js");

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
      // '--disable-3d-apis',
      // '--disable-accelerated-2d-canvas',
      // '--disable-accelerated-jpeg-decoding',
      // '--disable-accelerated-mjpeg-decode',
      // '--disable-accelerated-video-decode',
      // '--disable-app-list-dismiss-on-blur',
      // '--disable-canvas-aa',
      // '--disable-composited-antialiasing',
      // '--disable-gl-extensions',
      // '--disable-gpu',
      // '--disable-histogram-customizer',
      // '--disable-in-process-stack-traces',
      // '--disable-site-isolation-trials',
      // '--disable-threaded-animation',
      // '--disable-threaded-scrolling',
      // '--disable-webgl',
    ],
  },
});

app.addListener("saveMessage", (msg) => {
  console.log("salvando mensagem: ", msg);
});

app.addListener("sendMessage", (phone, media) => {
  console.log("Send mensagem: ", phone, media);
  app.sendMessage(phone, media);
});

app.addListener("messageToAPI", (text) => {
  app.sendMessage(process.env.API_ID, `API: ${text}`);
});

app.initialize();

module.exports = {
  app,
  whatsAppWeb,
};
