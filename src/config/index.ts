import { config as env } from "dotenv";

const parsed = env().parsed;
if (!parsed) {
  console.error("Crie o arquivo: .env");
}

export const configs = {
  GOOGLE: {
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
  },
};

if (process.env.GOOGLE_AUTH)
  configs.GOOGLE.AUTH = JSON.parse(process.env.GOOGLE_AUTH);

if (process.env.SPEECH_ID) configs.GOOGLE.SPEECH_ID = process.env.SPEECH_ID;

if (process.env.SEARCH_ID) configs.GOOGLE.SEARCH_ID = process.env.SEARCH_ID;

export default configs;
