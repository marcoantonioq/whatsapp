import { app, api } from "./whatsapp";
import moment from "moment";

app.on("ready", async () => {
  if (!api.locks) {
    api.sendToAPI(`${moment().format("DD/MM, h:mm")}`);
  }
});

app.on("message_create", async (msg) => {
  if (!api.locks) {
    const hello = /^api$|^oi$|^ping$|^info$/gi;
    if (msg.body.match(hello)) {
      api.sendToAPI("Olá!");
    }
  }
});
