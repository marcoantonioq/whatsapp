const msgs = require("./msgs");

app.on("ready", async () => {
  console.log("ENVIAR MENSAGEM...");
  for (const msg of msgs) {
    try {
      app.emit("sendMessage", msg.to, msg.text);
    } catch (e) {
      console.log(`to: ${msg.to};\tErro: ${e}`);
    }
  }
});
