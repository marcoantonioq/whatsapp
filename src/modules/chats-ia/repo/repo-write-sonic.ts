import configs from "@config/index";
import api from "api";
import { InterfaceRepository, Request } from "../core/Request";

const sdk = api("@writesonic/v2.2#4enbxztlcbti48j");

sdk.auth(configs.WRITESONIC.KEY);

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Request[]) {}

  async dialogs() {
    return this.data;
  }

  async requests() {
    return this.data;
  }

  async request(request: Request) {
    try {
      const result = await sdk.chatsonic_V2BusinessContentChatsonic_post(
        {
          input_text: request.body,
          enable_google_results: "true",
          enable_memory: true,
        },
        {
          engine: "premium",
          language: "pt-br",
        }
      );
      request.result = result.data.message;
      this.data.push(request);
    } catch (e) {
      console.log("Request:::", request);
      console.log("Erro WriteSonic: ", e);
    }
    return request;
  }
}
