import configs from "@config/index";
import api from "api";
const sdk = api("@writesonic/v2.2#4enbxztlcbti48j");

export const auth = (key: string) => {
  sdk.auth(configs.WRITESONIC.KEY);
};

export const text = async (text: string) => {
  const result = await sdk.chatsonic_V2BusinessContentChatsonic_post(
    {
      input_text: text,
      enable_google_results: true,
      enable_memory: true,
    },
    {
      engine: "premium",
      language: "pt-br",
      num_copies: "2",
    }
  );
  return result;
};

export default sdk;
