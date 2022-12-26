const { app, api } = require("./whatsapp");

app.on("message_create", async (msg) => {
  try {
    if (api.toAPI(msg)) {
      if (
        api.isEnable("send_citado") &&
        msg.body.trim().match(/^(ok|ok!|finalizar|cancelar|sair)$/gi)
      ) {
        api.disable("send_citado");
        api.send(`Encaminhamento de mensagens desativado!`);
      }

      if (api.isEnable("send_citado")) {
        let data, mimetype;
        const { from, body, notifyName, self, caption, type, hasMedia } = msg;
        if (hasMedia) {
          const media = await msg.downloadMedia();
          data = media.data;
          mimetype = media.mimetype;
        }
        for (const number of api.numbers) {
          const isRegistered = await app.isRegisteredUser(number);
          if (isRegistered) {
            console.log("Contato encontrado:::: ", isRegistered);
            app.emit("sendMessage", {
              from,
              to: number,
              group: "SEND",
              body: body,
              notifyName,
              self,
              caption,
              mimetype,
              type,
              data,
              hasMedia,
            });
          }
        }
      } else {
        const numeroCitado = /(\d{8})+/gi;
        if (msg.body.match(numeroCitado)) {
          api.enable("send_citado");
          api.numbers = msg.body;
          api.send(
            `▶️ Enviaremos novas mensagens para os números citados: ${api.numbersToString()}\n\n⏹️ (sair, ok)`
          );
          setTimeout(() => {
            api.disable("send_citado");
            msg.reply(
              `API: ⏹️ Paramos encaminhar msg para os números citados!`
            );
          }, 5 * 60 * 1000);
        }
      }
    }
  } catch (e) {
    api.send(`API: Erro no processamento ao criar mensagem: ${e}`);
  }
});
