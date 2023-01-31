import { Message as MSG } from "../core/Message";

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
