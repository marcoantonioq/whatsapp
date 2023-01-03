import { app } from "./whatsapp";
import db from "../data";
import { MessageFactory } from "./whatsapp.MessageFactory";

export enum Events {
  sending = "SEND",
  canceled = "canceled",
}

const createSendMessage = async (msg: any) => {};

app.addListener("sendMessageSaved", async () => {
  const msgs = await db.messages.findMany({
    where: { group: Events.sending, status: false },
    orderBy: { to: "asc" },
  });
  for (const msg of msgs) {
    try {
      const message = new MessageFactory(msg);
      if (message.content) {
        await db.messages.delete({
          where: {
            id: msg.id,
          },
        });
      }
    } catch (e) {
      console.log("Erro ao enviar mensagem salva: ", e);
    }
  }
  return msgs;
});

app.addListener("deleteMessageSaved", async () => {
  console.log("Apagar todas as mensagens!!!");
  await db.messages.deleteMany({
    where: {
      group: "SEND",
    },
  });
});

class MSG {
  to: string;
  text: string;
  constructor(to: string, text: string) {
    this.to = to;
    this.text = text;
  }
  sendMessage() {
    app.sendMessage(this.to, this.text);
  }
}

const msgs: MSG[] = [];

app.on("ready", async () => {
  console.log("ENVIAR MENSAGEM...");
  for (const msg of msgs) {
    try {
    } catch (e) {
      console.log(`to: ${msg.to};\tErro: ${e}`);
    }
  }
});
