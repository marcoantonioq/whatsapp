import { app, api } from "./whatsapp";

const canceledSend = () => {
  app.emit("deleteMessageSaved");
  api.disable("send_citado");
  api.send(`Envio cancelado!!!`);
};

const sendMensages = () => {
  app.emit("sendMessageSaved");
  api.disable("send_citado");
  api.send(`Encaminhamento de mensagens iniciado!`);
  api.clearNumbers()
};

app.on("message_create", async (msg) => {
  try {
    if (api.toAPI(msg)) {
      if (msg.body.match(/^(cancelar|sair)$/gi)) {
        canceledSend();
      }

      if (api.isEnable("send_citado")) {
        if (msg.body.trim().match(/^(enviar|ok)$/gi)) {
          sendMensages();
        }
      }

      if (api.isEnable("send_citado")) {
        let data, mimetype;
        const { from, body, type, hasMedia } = msg;
        if (hasMedia) {
          const media = await msg.downloadMedia();
          data = media.data;
          mimetype = media.mimetype;
        }
        const reg = / _NOME/gi;
        for (const number of api.numbers) {
          try {
            const contact: any = await app.getContactById(number);
            let ms = ["name", "pushname", "shortName"]
              .filter((title) => contact[title])
              .filter((title) => contact[title].trim() !== "")
              .reduce((acc, title) => {
                return acc.replace(reg, ` ${contact[title]}`);
              }, body);
            ms = ms.replace(reg, "");
            app.emit("saveMessage", {
              from,
              to: number,
              group: "SEND",
              body: ms,
              mimetype,
              type,
              data,
              hasMedia,
            });
          } catch (e: any) {
            console.log(`Erro ao criar mensagem: ${e}`);
          }
        }
      } else {
        const numeroCitado = /(\d{4}-\d{4}|\d{8})+/gi;
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
