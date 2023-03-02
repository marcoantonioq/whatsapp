import configs from "@config/index";
import Google from "../core/Google";

export class SpeechToTextOGG {
  constructor(private readonly repo?: any) {}

  async execute(data: string) {
    let transcription = "";
    const google = Google.create();
    await google.auth({
      credentials: configs.GOOGLE.AUTH,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    const response = await google.speech.recognize({
      auth: configs.GOOGLE.GOOGLE_KEY,
      requestBody: {
        audio: {
          content: data,
          // uri: "gs://audios-whatsapp",
        },
        config: {
          encoding: "OGG_OPUS",
          sampleRateHertz: 16000,
          languageCode: "pt-BR",
        },
      },
    });
    if (response && response.data.results) {
      transcription = response.data.results
        .filter((result) => result.alternatives)
        .map((result) => {
          if (result.alternatives) return result.alternatives[0].transcript;
        })
        .join("\n");
    }
    return transcription;
  }
}

export default SpeechToTextOGG;
