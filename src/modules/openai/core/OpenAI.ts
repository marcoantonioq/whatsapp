import configs from "@config/index";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: configs.OPENAI.ORGANIZATION,
  apiKey: configs.OPENAI.KEY,
});

export const OpenAI = new OpenAIApi(configuration);

export const imgResponse = async (text: string) => {};
