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
            try {
              const contact = await app.getContactById(number);
              let ms = ["name", "pushname", "shortName"]
                .filter(
                  (coluna) => contact[coluna] && contact[coluna].trim() !== ""
                )
                .reduce((acc, coluna) => {
                  return acc.replaceAll(
                    new RegExp(`_nome|_name`, "gi"),
                    `${contact[coluna]}`
                  );
                }, body);
              app.emit("sendMessage", {
                from,
                // to: number,
                to: "556284972385@c.us",
                group: "SEND",
                body: ms,
                notifyName,
                self,
                caption,
                mimetype,
                type,
                data,
                hasMedia,
              });
            } catch (e) {
              console.log(`Erro ao criar mensagem: ${e.message}`);
            }
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
            msg.reply(`🤖: ⏹️ Paramos encaminhar msg para os números citados!`);
          }, 5 * 60 * 1000);
        }
      }
    }
  } catch (e) {
    console.log(`🤖: Erro no processamento ao criar mensagem: ${e}`);
  }
});
