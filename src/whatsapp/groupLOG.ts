import { app } from "./whatsapp";
import fs from "fs";
import { GroupChat } from "whatsapp-web.js";

app.on("ready", async () => {
  const chats: any[] = await app.getChats()
  for (const chat of chats) {
    if (chat.isGroup) {
      try {
        const nameGroup = (chat.name || "").replace("/", "-");
        fs.appendFileSync(
          `out/${nameGroup}.csv`,
          `${new Date().toISOString()}\n`
        );
        const participants = await chat.participants;
        for (const participant of participants) {
          const { id, number, name, pushname } = await app.getContactById(
            participant.id._serialized
          );
          const log = `${number},${name},${pushname},${id._serialized}\n`;
          fs.appendFileSync(`out/${nameGroup}.csv`, log);
        }
      } catch (e) {
        console.log(`Erro READY log participantes grupos ${chat.name}:`, e);
      }
    }
  }
});
