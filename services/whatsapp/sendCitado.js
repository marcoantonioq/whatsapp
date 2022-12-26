const { app, api } = require("./whatsapp");

app.on("message_create", async (msg) => {
  try {
    if (api.toAPI(msg)) {
      const canceledSend = () => {
        app.emit("deleteMessageSaved");
        api.disable("send_citado");
        api.send(`Envio cancelado!!!`);
      };
      if (msg.body.match(/^(cancelar|sair)$/gi)) {
        canceledSend();
      }

      if (api.isEnable("send_citado")) {
        if (msg.body.trim().match(/^(enviar|ok)$/gi)) {
          app.emit("sendMessageSaved");
          api.disable("send_citado");
          api.send(`Encaminhamento de mensagens iniciado!`);
        }
      }

      if (api.isEnable("send_citado")) {
        let data, mimetype;
        const { from, body, notifyName, self, caption, type, hasMedia } = msg;
        if (hasMedia) {
          const media = await msg.downloadMedia();
          data = media.data;
          mimetype = media.mimetype;
        }
        const reg = / _NOME/gi;
        for (const number of api.numbers) {
          try {
            const contact = await app.getContactById(number);
            let ms = ["name", "pushname", "shortName"]
              .filter((title) => contact[title])
              .filter((title) => contact[title].trim() !== "")
              .reduce((acc, title) => {
                return acc.replaceAll(reg, ` ${contact[title]}`);
              }, body);
            ms = ms.replaceAll(reg, "");
            app.emit("saveMessage", {
              from,
              to: number,
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
      } else {
        const numeroCitado = /(\d{8})+/gi;
        if (msg.body.match(numeroCitado)) {
          api.numbers = msg.body;
          setTimeout(() => {
            api.send(
              `▶️ Enviaremos novas mensagens para: \n\n⏹️ Sair / Cancelar\n📤 Enviar / Ok\n\nNúmeros citados: ${api.numbersToString()}`
            );
            api.enable("send_citado");
          }, 8000);
          setTimeout(() => {
            msg.reply(`🤖: ⏹️ Paramos encaminhar msg para os números citados!`);
            api.disable("send_citado");
            canceledSend();
          }, 15 * 60 * 1000);
        }
      }
    }
  } catch (e) {
    console.log(`🤖: Erro no processamento ao criar mensagem: ${e}`);
  }
});
