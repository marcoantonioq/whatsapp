import { OpenAI } from "../core/OpenAI";

export class GetText {
  constructor(private readonly repo?: any) {}

  async execute(text: string) {
    const options = {
      model: "text-davinci-003",
      prompt: text,
      temperature: 1,
      max_tokens: 4000,
    };

    try {
      const response = await OpenAI.createCompletion(options);
      let botResponse = "";
      response.data.choices.forEach(({ text }) => {
        botResponse += text;
      });
      return `${botResponse.trim()}`;
    } catch (e: any) {
      return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
    }
  }
}

export default GetText;
