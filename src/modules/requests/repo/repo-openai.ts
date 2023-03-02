import configs from "@config/index";
import { Configuration, OpenAIApi } from "openai";
import { Request, InterfaceRepository } from "../core/Request";
const configuration = new Configuration({
  organization: configs.OPENAI.ORGANIZATION,
  apiKey: configs.OPENAI.KEY,
});
const openIA = new OpenAIApi(configuration);

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Request[]) {}

  async dialogs() {
    return this.data;
  }

  async requests() {
    return this.data;
  }

  async request(request: Request) {
    const options = {
      model: "text-davinci-003",
      prompt: request.body,
      temperature: 0.9,
      max_tokens: 4000,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [" Human:", " AI:"],
    };

    try {
      const response = await openIA.createCompletion(options);
      let botResponse = "";
      response.data.choices.forEach(({ text }) => {
        botResponse += text;
      });
      request.result = botResponse.trim();
      this.data.push(request);
    } catch (e: any) {
      request.error = `❌ OpenAI Response Error: ${e.response.data.error.message}`;
    }
    return request;
  }
}
