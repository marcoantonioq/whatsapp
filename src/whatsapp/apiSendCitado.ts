import { ContentMessage } from "../Message/ContentMessage";
import { app, api } from "./whatsapp";

app.on("message_create", async (msg) => {
  try {
    if (api.isToAPI(msg)) {
      if (msg.body.match(/^(cancelar|sair)$/gi)) {
        api.mensagens.forEach((message) => message.delete);
      }

      if (api.isEnable("send_citado")) {
        if (msg.body.trim().match(/^(enviar|ok)$/gi)) {
          for (const message of api.mensagens) {
            try {
              message.send();
              message.delete();
            } catch (e: any) {
              console.log(`Erro ao enviar mensagens: ${e}`);
            }
          }
        }
      }

      if (api.isEnable("send_citado")) {
        await Promise.all(
          api.arrayNumbers().map(async (number) => {
            try {
              const message = new ContentMessage();
              const { data } = message;
              if (data) {
                data.to = number;
                data.from = msg.from;
                data.body = msg.body;
                data.type = msg.type;
                data.hasMedia = msg.hasMedia;
                if (data.hasMedia) {
                  const media = await msg.downloadMedia();
                  data.data = media.data;
                  data.mimetype = media.mimetype;
                }
                message.save();
              }

              return message;
            } catch (error) {
              console.log("Erro ao criar mensagem apiSendCitado: ", error);
            }
          })
        );
      } else {
        const numeroCitado = /(\d{4}-\d{4}|\d{8})+/gi;
        if (msg.body.match(numeroCitado)) {
          api.numbers = msg.body;
        }
      }
    }
  } catch (e) {
    console.log(`🤖: Erro no processamento ao criar mensagem: ${e}`);
  }
});
