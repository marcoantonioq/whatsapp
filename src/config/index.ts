import { WhatsappSettings, GOOGLE } from "@types";
import { config as env } from "dotenv";
import { config } from "process";
const parsed = env().parsed;

export const configs = {
  WRITESONIC: {
    KEY: parsed?.WRITESONIC_KEY,
  },
  OPENAI: {
    KEY: parsed?.OPENAI_KEY,
    ORGANIZATION: parsed?.OPENAI_ORGANIZATION,
  },
  WHATSAPP: <WhatsappSettings>{
    MY_NUMBER: parsed?.MY_NUMBER,
    GROUP_API: parsed?.GROUP_API,
    clientId: "MARCO",
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
