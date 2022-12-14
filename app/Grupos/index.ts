import { app } from "../Whatsapp";
import { api } from "../Api";
import fs from "fs";

app.on("ready", async () => {
  const chats: any[] = await app.getChats();
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

/**
 * groupLeave: O usuário saiu ou foi expulso do grupo
 * @param {notification} notification Notification whatsapp
 */
async function subscribe(notification: any) {
  const { name: chatName } = await notification.getChat();
  const contact = await notification.getContact();
  const type = notification.type === "remove" ? "➖ 📵" : "➕ 📲";
  const participant = notification.id.participant.replace("@c.us", "");
  api.sendToAPI(
    `${type} ${participant} grupo ${chatName} por 🙋‍♂️ ${
      contact.name || contact.pushname
    }!`
  );
}

app.on("group_join", subscribe);
app.on("group_leave", subscribe);
