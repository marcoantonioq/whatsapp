const whats = require('../../components/whatsapp');
const sheet = require('../../components/google/sheets');
const phone = require('../../lib/phonenumber');
const api = require('../../enums/api');
const { app } = whats;

/**
 * Criar uma regex
 * @param {String} regex
 * @returns function
 */
const regex = (regex) => {
  return (text) => {
    return new RegExp(regex, 'gi').exec(text);
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

// eslint-disable-next-line require-await
async function createMsgGoogleGroups(msg) {
  try {
    if (msg.fromMe) {
      // API
      if (msg.to === api.id) {
        let isRun = true;
        // Encaminhamento de mensagens nos grupos Google cotnatos
        const rgEncaminharMensagem = /(send |mensagem |msg )(para |)(.*)$/gi;
        if (msg.body.match(rgEncaminharMensagem)) {
          try {
            isRun = false;
            const contatos = await sheet.getValues('Contatos');

            const grupos = await sheet.getValues('Grupos');
            const txtGrupos = grupos.map((el) => el._GRUPOS).join(', ');
            const result = rgEncaminharMensagem
              .exec(msg.body)[3]
              .trim()
              .toLowerCase();
            let isGroupValid = regex(result);
            const grupo =
              grupos.find((el) => isGroupValid(el._GRUPOS))?._GRUPOS || '';
            if (isEmpty(grupo) || !regex(grupo)(txtGrupos)) {
              api.reply(
                msg,
                `Grupo ${
                  grupo || result
                } inválido! \nGrupos disponíveis: ${txtGrupos}`
              );
              return false;
            }
            isGroupValid = regex(grupo);
            setTimeout(() => {
              try {
                api.reply(
                  msg,
                  `Paramos de receber novas mensagens para ${grupo}!`
                );
                api.cmd = () => {};
              } catch (e) {}
            }, 5 * 60 * 1000);
            const newCotatos = contatos
              .filter((el) => isGroupValid(el._GRUPOS))
              .map((el) => {
                return {
                  ...el,
                  tel: el._TELEFONES
                    .split(',')
                    .map((el) => phone.format(el.trim())),
                };
              })
              .filter((el) => el.tel.length > 0);

            if (newCotatos.length === 0) {
              api.reply(msg, `Nenhum contato para o grupo ${grupo}!`);
              return false;
            }
            api.reply(msg, `Ok, encaminharemos novas mensagens para ${grupo}!`);

            api.cmd = function (msg) {
              newCotatos.forEach((el) => {
                if (msg.body.trim()) {
                  el.tel.forEach(async (tel) => {
                    return await app.sendMessage(
                      tel,
                      await sheet.replaceInRow(msg.body, el)
                    );
                  });
                } else {
                  el.tel.forEach((tel) => {
                    msg.forward(tel);
                  });
                }
              });
            };
          } catch (e) {
            isRun = false;
            console.log(`Erro ao processar mensagem: ${e}`);
          }
        }
        if (msg.body.trim().match(/^(ok|ok!|finalizar|cancelar|sair)$/gi)) {
          api.reply(msg, `Ok, todos os comandos foram removidos!`);
          api.cmd = () => {};
        }
        if (isRun) {
          api.cmd(msg);
        }
      }
    }
  } catch (e) {
    console.log(`Erro: ${e}`);
    api.sendMessage(`Erro: ${e}`);
  }
}

module.exports = {
  createMsgGoogleGroups,
};
