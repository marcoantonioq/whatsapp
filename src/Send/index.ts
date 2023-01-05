// enviar mensagem arquivo json e apagar arquivo json!

/**
 * em criação
 */
import { app } from "../Whatsapp";

import { Message as MSG } from "../Message";

export enum Events {
  sending = "SEND",
  canceled = "canceled",
}

const msgs: MSG[] = [];

app.on("ready", async () => {
  console.log("ENVIAR MENSAGEM...");
  for (const msg of msgs) {
    try {
    } catch (e) {
      // console.log(`to: ${msg.to};\tErro: ${e}`);
    }
  }
});
