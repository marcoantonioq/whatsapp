import configs from "@config/index";
import { InterfaceRepository, Dialog } from "@modules/openai/core/OpenAI";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  organization: configs.OPENAI.ORGANIZATION,
  apiKey: configs.OPENAI.KEY,
});
const openIA = new OpenAIApi(configuration);

export interface request {
  id?: string;
  from?: string;
  to?: string;
  body: string;
  type: "text" | "img";
  result?: string;
  error?: string;
  create?: Date;
}

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Dialog[]) {}

  async dialogs() {
    return this.data;
  }

  async requests() {
    return this.data;
  }

  async request(request: request) {
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
      let dialog: Dialog | undefined = this.data.find(
        (dialog) => dialog.to === request.to && dialog.from === request.from
      );
      if (!dialog) {
        dialog = Dialog.create({
          id: `${request.to}-${request.from}`,
          to: request.to,
          from: request.from,
        });
        this.data.push(dialog);
      }
      dialog.messages.push(request);
    } catch (e: any) {
      request.error = `❌ OpenAI Response Error: ${e.response.data.error.message}`;
    }
    return request;
  }
}
