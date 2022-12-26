const { app, api } = require("../modules/whatsapp");

app.on("message_create", async (msg) => {
  try {
    if (api.toAPI(msg)) {
      return true;
    }
  } catch (e) {
    console.log(`Erro no processamento ao criar mensagem: ${e}`);
  }
});
