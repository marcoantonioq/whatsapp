const whats = require('../../components/whatsapp');
const sheet = require('../../components/google/sheets');
const phone = require('../../lib/phonenumber');
const { app } = whats;

let contatos = [];
sheet.getValues('Contatos').then((result) => {
  contatos = result;
});

let grupos = [];
let txtGrupos = '';
sheet.getValues('Grupos').then((result) => {
  grupos = result;
  txtGrupos = grupos
    .map((el) => el._GRUPOS)
    .join(', ')
    .toLowerCase();
});
const api = {
  id: '120363042441548855@g.us',
  confirmed: true,
  sendMessage(text) {
    app.sendMessage(this.id, `API: ${text}`);
  },
  reply(msg, text) {
    msg.reply(`API: ${text}`);
  },
  cmd(_msg) {},
};

// eslint-disable-next-line require-await
async function createMsgGoogleGroups(msg) {
  try {
    if (msg.fromMe) {
      // API
      if (msg.to === api.id) {
        let isRun = true;
        // Encaminhamento de mensagens nos grupos Google cotnatos
        const rgEncaminharMensagem = /(mensagem |msg )(para |)(.*)$/gi;
        if (msg.body.match(rgEncaminharMensagem)) {
          try {
            isRun = false;
            const result = rgEncaminharMensagem
              .exec(msg.body)[3]
              .trim()
              .toLowerCase();
            console.log('Result::', result);
            const gp = grupos.find((el) =>
              el._GRUPOS.toLowerCase().includes(result)
            )._GRUPOS;
            if (!gp || !txtGrupos.includes(gp.toLowerCase())) {
              api.reply(
                msg,
                `Grupo ${gp} inválido! \nGrupos disponíveis: ${txtGrupos}`
              );
              return false;
            }
            api.reply(msg, `Ok, encaminharemos novas mensagens para ${gp}!`);
            setTimeout(() => {
              try {
                api.reply(msg, `Paramos de receber suas mensagens para ${gp}`);
                api.cmd = () => {};
              } catch (e) {}
            }, 5 * 60 * 1000);
            const newCotatos = contatos
              .filter((el) => {
                try {
                  return el._GRUPOS.toLowerCase().includes(gp.toLowerCase());
                } catch (e) {
                  return false;
                }
              })
              .map((el) => {
                return {
                  ...el,
                  tel: el._TELEFONES
                    .split(',')
                    .map((el) => phone.format(el.trim())),
                };
              })
              .filter((el) => el.tel.length > 0);

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
