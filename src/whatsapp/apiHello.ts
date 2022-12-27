import { app, api } from "./whatsapp";

app.on("ready", async () => {
  if (!api.locks) {
    api.send(`${new Date().toLocaleString()}`);
  }
});

app.on("message_create", async (msg) => {
  if (!api.locks) {
    const hello = /^api$|^oi$|^ping$|^info$/gi;
    if (msg.body.match(hello)) {
      api.send("Olá!");
    }
  }
});
