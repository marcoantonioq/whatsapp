const { app, api } = require("./whatsapp");

app.on("ready", async () => {
  api.send(`${new Date().toLocaleString()}`);
});

app.on("message_create", async (msg) => {
  const hello = /^api$|^oi$|^ping$|^info$/gi;
  if (msg.body.match(hello)) {
    api.send("Olá!");
  }
});
