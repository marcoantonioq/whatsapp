import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export const textResponse = async (text: string) => {
  const options = {
    model: "text-davinci-003",
    prompt: text,
    temperature: 1,
    max_tokens: 4000,
  };

  try {
    const response = await openai.createCompletion(options);
    let botResponse = "";
    response.data.choices.forEach(({ text }) => {
      botResponse += text;
    });
    return `${botResponse.trim()}`;
  } catch (e: any) {
    return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
  }
};

export const imgResponse = async (text: string) => {
  const request = {
    prompt: text,
    n: 1,
  };

  try {
    const response = await openai.createImage(request);
    return response.data.data[0].url;
  } catch (e: any) {
    return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
  }
};
