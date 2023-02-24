import { Dialog } from "../core/OpenAI";

export class GetImage {
  constructor(private readonly repo?: any) {}

  async execute(text: string) {
    const request = {
      prompt: text,
      n: 1,
    };

    try {
      const response = await Dialog.createImage(request);
      return response.data.data[0].url;
    } catch (e: any) {
      return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
    }
  }
}

export default GetImage;
