import { WhatsappSettings, GOOGLE } from "@types";
import { config as env } from "dotenv";
import { config } from "process";
const parsed = env().parsed;

export const configs = {
  OPENAI: {
    KEY: parsed?.OPENAI_KEY,
    ORGANIZATION: parsed?.OPENAI_ORGANIZATION,
  },
  WHATSAPP: <WhatsappSettings>{
    clientId: "MARCO",
    ID_API: parsed?.API_ID,
    puppeteer: {
      executablePath: "/usr/bin/google-chrome-stable",
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
  },
  GOOGLE: <GOOGLE>{
    AUTH: {
      type: "",
      project_id: "",
      private_key: "",
      client_email: "",
      client_id: "",
      auth_uri: "",
      token_uri: "",
      auth_provider_x509_cert_url: "",
      client_x509_cert_url: "",
    },
    GOOGLE_KEY: "",
    SEARCH_ID: "",
    SHEET_DOC_ID: "",
  },
};

if (parsed) {
  if (process.env.GOOGLE_AUTH)
    configs.GOOGLE.AUTH = JSON.parse(parsed.GOOGLE_AUTH);

  if (parsed.GOOGLE_KEY) configs.GOOGLE.GOOGLE_KEY = parsed.GOOGLE_KEY;

  if (parsed.SEARCH_ID) configs.GOOGLE.SEARCH_ID = parsed.SEARCH_ID;

  if (parsed.SHEET_DOC_ID) configs.GOOGLE.SHEET_DOC_ID = parsed.SHEET_DOC_ID;
} else {
  console.error("Crie o arquivo: .env");
}

export default configs;
