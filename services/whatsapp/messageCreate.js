const { app } = require("../modules/whatsapp");

app.on("message_create", (msg) => {
  try {
    if (msg.body.startsWith("API:")) {
      return true;
    }
  } catch (e) {
    console.log(`Erro no processamento ao criar mensagem: ${e}`);
  }
});
