import { GOOGLE, AUTH } from "@libs/google/types";
import { config as env } from "dotenv";

export const configs = {
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
    SPEECH_ID: "",
    SEARCH_ID: "",
    SHEET_DOC_ID: "",
  },
};

const parsed = env().parsed;
if (parsed) {
  if (process.env.GOOGLE_AUTH)
    configs.GOOGLE.AUTH = JSON.parse(parsed.GOOGLE_AUTH);

  if (parsed.SPEECH_ID) configs.GOOGLE.SPEECH_ID = parsed.SPEECH_ID;

  if (parsed.SEARCH_ID) configs.GOOGLE.SEARCH_ID = parsed.SEARCH_ID;

  if (parsed.SHEET_DOC_ID) configs.GOOGLE.SHEET_DOC_ID = parsed.SHEET_DOC_ID;
} else {
  console.error("Crie o arquivo: .env");
}

export default configs;
