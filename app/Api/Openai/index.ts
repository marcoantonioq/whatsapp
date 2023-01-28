import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

export const textResponse = async (text: string) => {
  const options = {
    model: "text-davinci-003", // Modelo GPT a ser usado
    prompt: text, // Texto enviado pelo usuário
    temperature: 1, // Nível de variação das respostas geradas, 1 é o máximo
    max_tokens: 4000, // Quantidade de tokens (palavras) a serem retornadas pelo bot, 4000 é o máximo
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
  const options = {
    prompt: text, // Descrição da imagem
    n: 1, // Número de imagens a serem geradas
  };

  try {
    const response = await openai.createImage(options);
    return response.data.data[0].url;
  } catch (e: any) {
    return `❌ OpenAI Response Error: ${e.response.data.error.message}`;
  }
};
