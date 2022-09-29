/* eslint-disable no-console */
const phone = require('../lib/phonenumber');
const sheet = require('../lib/google/sheets');

const contatos = {};

sheet.getRows('Contatos').then((result) => {
  result.forEach((el) => {
    (el._TELEFONES || '')
      .split(',')
      .map((tel) => phone.format(tel.trim()))
      .forEach((tel) => {
        contatos[tel] = el._NOME;
      });
  });
});

sheet.getRows('Save').then((result) => {
  result.forEach((el) => {
    contatos[phone.format(el['Phone 1 - Value'])] = el.Name;
  });
});

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

class Groups {
  constructor(storage) {
    this.storage = storage || [];
  }

  set values(str) {
    if (str) this.storage.push(str);
  }

  get values() {
    return this.storage;
  }
}

const whatsapp = {
  /**
   * Envia mensagens agendados na planilha Contatos aba Contatos coluna _MSG
   * @param {Whatsapp} msg Whatsapp msg
   */
  // eslint-disable-next-line require-await
  async createMsgGoogleContacts(state) {
    try {
      const { app } = state.whatsapp;
      const myInterval = setInterval(async () => {
        try {
          const contatos = await sheet.getRows('Contatos');
          contatos
            .filter((el) => el._MSG)
            .forEach((el) => {
              el._TELEFONES
                .split(',')
                .map((tel) => phone.format(tel.trim()))
                .forEach(async (tel) => {
                  app.sendMessage(tel, await sheet.replaceInRow(el._MSG, el));
                  el._MSG = '';
                  el.save();
                });
            });
        } catch (e) {
          state.logger.erro(`Erro no serviço de envio de mensagens: ${e}`);
          clearInterval(myInterval);
        }
      }, 5 * 60 * 1000);
      return myInterval;
    } catch (e) {
      state.logger.erro(`Erro ao em criar mensagens dos contatos: ${e}`);
    }
  },
  /**
   * Envia mensagem para os Marcadores do Google Contatos utilizando a API
   * @param {State} state Estado da aplicação
   * @param {Whatsapp} msg Mensagem do Whatsapp
   * @returns
   */
  async createMsgGoogleGroups(state, msg) {
    const { api } = state;
    const { app } = state.whatsapp;
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
              const { contatos } = state;

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
                state.api.reply(
                  msg,
                  `Grupo ${
                    grupo || result
                  } inválido! \nGrupos disponíveis: ${txtGrupos}`
                );
                return false;
              }
              isGroupValid = regex(grupo);
              setTimeout(() => {
                state.api.reply(
                  msg,
                  `Paramos encaminhar mensagens msg para ${grupo}!`
                );
                api.cmd = () => {};
              }, 5 * 60 * 1000);
              const newContatos = contatos.values
                .filter((el) => isGroupValid(el._GRUPOS))
                .map((el) => {
                  return {
                    ...el,
                    tel: el._TELEFONES.split(',').map((el) => phone.format(el)),
                  };
                })
                .filter((el) => el._NOME && el.tel.length > 0);

              if (newContatos.length === 0) {
                state.api.reply(
                  msg,
                  `API: Nenhum contato para o grupo ${grupo}!`
                );
                return false;
              }
              state.api.reply(
                msg,
                `API: Ok, encaminharemos novas mensagens para ${grupo} com ${newContatos.length} participantes! \n\n *Sair: (ok/sair)*`
              );

              // eslint-disable-next-line require-await
              api.cmd = async function (msg) {
                const telSends = {};
                for (const el of newContatos) {
                  if (!msg.body.startsWith('API:')) {
                    for (const tel of el.tel) {
                      if (tel && !telSends[tel]) {
                        try {
                          if (msg.body.trim()) {
                            await app.sendMessage(
                              tel,
                              contatos.replaceInRow(msg.body, el)
                            );
                          } else {
                            msg.forward(tel);
                          }
                        } catch (e) {
                          state.logger.erro(
                            `Erro ao enviar mensagens para ${el.tel}: ${e}`
                          );
                        }
                      }
                      telSends[tel] = msg.body;
                    }
                  }
                }
              };
            } catch (e) {
              isRun = false;
              const ms = `API: Erro ao processar mensagem: ${e}`;
              state.logger.error(ms);
              state.api.sendMessage(ms);
            }
          }
          try {
            if (msg.body.trim().match(/^(ok|ok!|finalizar|cancelar|sair)$/gi)) {
              api.cmd = () => {};
              msg.reply(`API: Ok, todos os comandos foram removidos!`);
            }
            if (isRun) {
              api.cmd(msg);
            }
          } catch (e) {
            const ms = `Erro: ${e}`;
            api.cmd = () => {};
            state.logger.error(ms);
            state.api.sendMessage(ms);
          }
        }
      }
    } catch (e) {
      const ms = `Erro: send Group: ${e}`;
      state.logger.error(ms);
      state.api.sendMessage(ms);
    }
  },
  // eslint-disable-next-line require-await
  async createWhatsappLink(state, msg) {
    try {
      if (msg.fromMe) {
        if (msg.to === state.api.id) {
          const contact = phone.format(msg.body);
          if (contact) {
            msg.reply(`API: https://wa.me/${contact.replace(/@.*/gi, '')} `);
          }
        }
      }
    } catch (e) {
      const ms = `Erro whatsAppLink: ${e}`;
      state.logger.error(ms);
      state.api.sendMessage(ms);
    }
  },
  async saveQRGoogleSheet(state, qr) {
    try {
      const doc = await sheet.getDoc();
      const plan = doc.sheetsByTitle.Whatsapp;
      await plan.loadCells('A1:A3');
      const A2 = plan.getCellByA1('A2');
      A2.value = `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`;
      A2.save();
      const A3 = plan.getCellByA1('A3');
      A3.value = `Data: ${new Date().toLocaleString()}`;
      A3.save();
    } catch (e) {
      const ms = `Erro saveQRCode: ${e}`;
      state.logger.error(ms);
      state.api.sendMessage(ms);
    }
  },
  /**
   * Registra log de mensagens no google sheet (MSG)
   * @param {State} state Estado da aplicação
   * @param {Whatsapp} msg Mensagem whatsapp
   */
  async logMsg(state, msg) {
    try {
      const doc = await sheet.getDoc();
      const plan = doc.sheetsByTitle.LOG;
      if (msg.body && msg.fromMe) {
        plan.addRow({
          DE: msg.from,
          PARA: msg.to,
          MSG: msg.body,
          TYPE: msg.mimetype,
        });
      }
    } catch (e) {
      state.logger.error(`Erro logMSG ${e}`);
    }
  },
  /**
   * Salva o contato de novas conversas no Google Sheet
   * @param {Store} state Estado da aplicação
   * @param {Whatsapp} msg Whatsapp message
   */
  // eslint-disable-next-line require-await
  async AutoSaveGoogleContatos(state, msg) {
    try {
      const contact = await msg.getContact();
      const chat = await msg.getChat();
      // state.logger.log('Contact: ', contact);
      // state.logger.log('Chat: ', chat);

      if (!contatos[contact.id._serialized]) {
        const groups = new Groups();
        const doc = await sheet.getDoc();
        const plan = doc.sheetsByTitle.Save;
        groups.values = 'AutoSave';
        if (chat.isGroup && !phone.format(chat.name)) {
          groups.values = chat.name;
        }
        contatos[contact.id._serialized] = contact.name || contact.pushname;
        plan.addRow({
          Name: contact.name || contact.pushname,
          Birthday: '',
          Notes: contact.pushname,
          'Group Membership': groups.values.join(', '),
          'Phone 1 - Value': contact.number.replace(/(\d\d)(\d{8}$)/g, '$19$2'),
          'Organization 1 - Name': '',
        });
      }
    } catch (e) {
      state.logger.erro(`Erro AutoSave contatos no google sheets: ${e}`);
    }
  },
  sendMessagesCRON(state) {
    state.logger.log('Cron mensagens');
  },
};

module.exports = whatsapp;
