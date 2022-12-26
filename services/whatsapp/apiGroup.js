const contatos = require("../contatos");
const { app, api } = require("./whatsapp");
const phone = require("../phone");

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
    if (api.toAPI(msg)) {
      let isRun = true;
      // Encaminhamento de mensagens nos grupos Google contatos
      const rgEncaminharMensagem = /(send |mensagem |msg )(para |)(.*)$/gi;
      if (msg.body.match(rgEncaminharMensagem)) {
        try {
          isRun = false;
          api["group_api"] = true;

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

          if (newContatos.length === 0) {
            msg.reply(`API: Nenhum contato para o grupo ${grupos.join(", ")}!`);
            return false;
          }

          msg.reply(
            `${new Date().toLocaleString().replace(",", "")}: Participantes (${
              newContatos.length
            }): \n${newContatos
              .map((el) => `${el._NOME}:\t ${el._TELEFONES}`)
              .join("\n")}`
          );
        } catch (e) {
          isRun = false;
          const ms = `Erro ao processar mensagem: ${e}`;
          console.error(ms);
          api.send(ms);
        }
      }
    }
  } catch (e) {
    const ms = `Erro: send Group: ${e}`;
    console.error(ms);
    api.send(ms);
  }
});
