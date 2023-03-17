import { messages, questionAPI, sendTextAPI, transcreverAudio } from ".";

export async function TranscricaoAudio(input: string) {
  while (true) {
    const msg = await questionAPI("Ok, envie o audio [(s)sair]:");
    if (/^(s|sair)$/gi.test(msg.body || "")) break;
    if (msg.hasMedia && ["audio", "ptt"].includes(msg.type || "")) {
      const media = await messages.downloadMedia(msg.id);
      sendTextAPI(`Transcrição: \n\n"${await transcreverAudio(media)}"`);
    }
  }
  return "Transcrição realizada!";
}
