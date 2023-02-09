import { google } from "googleapis";
import { SpeechClient } from "@google-cloud/speech";
import configs from "@config/index";

const GOOGLE_KEY = process.env.GOOGLE_API || "";

const customSearch = google.customsearch({
  version: "v1",
});

export const speechToTextOGG = async (data: string) => {
  const client = new SpeechClient({
    credentials: configs.GOOGLE.AUTH,
  });
  client.auth.fromAPIKey(GOOGLE_KEY);
  const [response] = await client.recognize({
    audio: {
      content: data,
    },
    config: {
      encoding: "OGG_OPUS",
      sampleRateHertz: 16000,
      languageCode: "pt-BR",
    },
  });

  if (response && response.results) {
    const transcription = response.results
      .filter((result) => result.alternatives)
      .map((result) => {
        if (result.alternatives) return result.alternatives[0].transcript;
      })
      .join("\n");
    return transcription;
  }
};

export const search = async (text: string) => {
  const response = await customSearch.cse.list({
    auth: GOOGLE_KEY,
    cx: process.env.SEARCH_ID,
    q: text,
    num: 5,
  });
  if (response.data.items) {
    return response.data.items.reduce((acc, item) => {
      acc += `\n\n${item.title}\n${item.snippet}\n${item.link}`;
      return acc;
    }, "");
  }
};

export default { search };
