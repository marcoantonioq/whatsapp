const { app } = require("./whatsapp");
const msgs = [];

app.on("ready", async () => {
  console.log("ENVIAR MENSAGEM...");
  for (const msg of msgs) {
    try {
      app.sendMessage(msg.to, msg.text);
    } catch (e) {
      console.log(`to: ${msg.to};\tErro: ${e}`);
    }
  }
});
