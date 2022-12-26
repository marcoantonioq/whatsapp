const { app, api } = require("./whatsapp");

app.on("ready", async () => {
  api.send(`🤖 ${new Date().toLocaleString()}`);
});

app.on("message_create", (msg) => {
  const hello = /^api$|ping|info/gi;
  if (msg.body.match(hello)) {
    api.send("Olá 🤖!");
  }
});
