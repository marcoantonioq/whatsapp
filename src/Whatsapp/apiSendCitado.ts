import { Message } from "../Message";
import { app, api } from "./whatsapp";

app.on("message_create", async (msg) => {
  try {
    if (api.isToAPI(msg)) {
      if (api.isEnable("send_citado")) {
        if (msg.body.match(/^(cancelar|sair)$/gi)) {
          api.mensagens.forEach((message) => message.destroy);
          api.disable("send_citado");
        }

        if (msg.body.trim().match(/^(enviar|ok)$/gi)) {
          for (const message of api.mensagens) {
            try {
              await message.send();
              await message.destroy();
              api.disable("send_citado");
            } catch (e: any) {
              console.log(`Erro ao enviar mensagens: ${e}`);
            }
          }
        } else {
          api.arrayNumbers().forEach(async (number) => {
            try {
              const message = new Message();
              const { data: dt } = message;
              dt.to = number;
              dt.from = msg.from;
              dt.body = msg.body;
              dt.type = msg.type;
              dt.hasMedia = msg.hasMedia;
              if (dt.hasMedia) {
                const media = await msg.downloadMedia();
                dt.data = media.data;
                dt.mimetype = media.mimetype;
              } else {
                await message.replaceNomeContact();
              }
              await message.save();
              api.mensagens.push(message);
              return message;
            } catch (error) {
              console.log("Erro ao criar mensagem apiSendCitado: ", error);
            }
          });
        }
      } else {
        const numeroCitado = /(\d{4}-\d{4}|\d{8})+/gi;
        if (msg.body.match(numeroCitado)) {
          api.enable("send_citado");
          api.numbers = msg.body;
        }
      }
    }
  } catch (e) {
    console.log(`🤖: Erro no processamento ao criar mensagem: ${e}`);
  }
});
