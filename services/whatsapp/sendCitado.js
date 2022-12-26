const { app, locks } = require("./whatsapp");

app.on("message_create", (msg) => {
  try {
    if (
      !msg.body.startsWith("API:") &&
      msg.fromMe &&
      msg.to === process.env.API_ID
    ) {
      console.log(':::::::', locks);
      locks["send_citado"] = true;
      console.log("Citado numero: ", msg.body);
      // const numebers = msg.body.split(/(\n|,)/gi)
      // << Continuar criando: quando enviado um numero de telefone, será encaminhados as mensagens dos proximos 5min >>>
    }
  } catch (e) {
    console.log(`Erro no processamento ao criar mensagem: ${e}`);
  }
});
