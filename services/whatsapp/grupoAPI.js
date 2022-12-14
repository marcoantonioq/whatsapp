const contatos = require("../contatos");
const { app } = require("./whatsapp");
const phone = require("../phone");

const api = {
  cmd() {},
};

/**
 * Criar uma regex
 * @param {String} regex
 * @returns function
 */
const regex = (regex) => {
  return (text) => {
    return new RegExp(regex, "gi").exec(text);
  };
};

/**
 * É vazio
 * @param {String} str
 * @returns Boolean
 */
function isEmpty(str) {
  return !str || str.length === 0;
}

/**
 * createMsgGoogleGroups: Envia mensagem para os Marcadores do Google Contatos utilizando a API
 * @param {msg} msg Mensagem do WhatsApp
 * @returns
 */
app.on("message_create", async (msg) => {
  try {
    if (
      !msg.body.startsWith("API:") &&
      msg.fromMe &&
      msg.to === process.env.API_ID
    ) {
      let isRun = true;
      // Encaminhamento de mensagens nos grupos Google contatos
      const rgEncaminharMensagem = /(send |mensagem |msg )(para |)(.*)$/gi;
      if (msg.body.match(rgEncaminharMensagem)) {
        try {
          isRun = false;

          const gpInformado = rgEncaminharMensagem
            .exec(msg.body)[3]
            .trim()
            .split(",")
            .map((el) => el.trim().toUpperCase());
          const grupos = contatos.groups
            .filter((el) =>
              gpInformado.some((gp) => regex(gp)(el._GRUPOS.toUpperCase()))
            )
            .map((el) => el._GRUPOS);
          const notGrupos = contatos.groups
            .filter((el) =>
              gpInformado.some((gp) => {
                if (gp.startsWith("!")) {
                  return regex(gp.replace(/^!/g, ""))(el._GRUPOS.toUpperCase());
                }
                return false;
              })
            )
            .map((el) => el._GRUPOS);

          console.log("Grupos ignorados: ", notGrupos);
          if (!grupos || isEmpty(grupos.join(""))) {
            msg.replay(
              `API: Grupo ${gpInformado.join(
                ", "
              )} inválido! \nGrupos disponíveis: ${contatos.groups
                .map((el) => el._GRUPOS)
                .join(", ")}`
            );
            return false;
          }
          setTimeout(() => {
            api.cmd = () => {};
            msg.reply(`API: Paramos encaminhar msg para ${grupos.join(", ")} `);
          }, 5 * 60 * 1000);
          const newContatos = contatos.values
            .filter((el) => grupos.some((gp) => regex(gp)(el._GRUPOS)))
            .filter((el) => !notGrupos.some((gp) => regex(gp)(el._GRUPOS)))
            .map((el) => {
              return {
                ...el,
                tel: el._TELEFONES.split(",").map((el) => phone.format(el)),
              };
            })
            .filter((el) => el._NOME && el.tel.length > 0);

          // console.log("Contatos", newContatos);

          if (newContatos.length === 0) {
            msg.reply(`API: Nenhum contato para o grupo ${grupos.join(", ")}!`);
            return false;
          }
          msg.reply(
            `API: Ok, encaminharemos novas mensagens para ${grupos.join(
              ", "
            )} com ${newContatos.length} participantes! \n\n *Sair: (ok/sair)*`
          );

          msg.reply(
            `API: Participantes: ${newContatos
              .map((el) => el._NOME)
              .join(", ")}! \n\n *Sair: (ok/sair)*`
          );

          /**
           * Funtion
           * @param {msg} msg
           */
          // eslint-disable-next-line require-await
          api.cmd = async function (msg) {
            const telSends = {};
            let data, mimetype;
            const { from, body, notifyName, self, caption, type, hasMedia } =
              msg;
            if (hasMedia) {
              const media = await msg.downloadMedia();
              data = media.data;
              mimetype = media.mimetype;
            }
            for (const el of newContatos) {
              if (!msg.body.startsWith("API:")) {
                const ms = Object.keys(el)
                  .filter((el) => el.match(/^_[a-z]/gi))
                  .reduce((acc, coluna) => {
                    return acc.replaceAll(
                      new RegExp(`${coluna}`, "gi"),
                      `${el[coluna]}`
                    );
                  }, body);
                for (const tel of el.tel) {
                  if (tel && !telSends[tel]) {
                    const date = new Date().toISOString();
                    app.emit("sendMessage", {
                      from,
                      to: tel,
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
                  }
                  telSends[tel] = msg.body;
                }
              }
            }
          };
        } catch (e) {
          isRun = false;
          const ms = `Erro ao processar mensagem: ${e}`;
          console.error(ms);
          app.emit("messageToAPI", ms);
        }
      }
      try {
        if (msg.body.trim().match(/^(ok|ok!|finalizar|cancelar|sair)$/gi)) {
          api.cmd = () => {};
          msg.reply(`Ok, todos os comandos foram removidos!`);
        }
        if (isRun) {
          api.cmd(msg);
        }
      } catch (e) {
        const ms = `Erro: ${e}`;
        api.cmd = () => {};
        console.error(ms);
        app.emit("messageToAPI", ms);
      }
    }
  } catch (e) {
    const ms = `Erro: send Group: ${e}`;
    console.error(ms);
    app.emit("messageToAPI", ms);
  }
});
