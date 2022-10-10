/**
 * TypeScript message
 * @typedef { import("../store/state").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 */

/* eslint-disable require-await */
/* eslint-disable no-console */
const whatsAppWeb = require('whatsapp-web.js');
const settings = require('../../config/global');
const sheet = require('../lib/google-sheets');
const phone = require('../lib/phonenumber');
const qrcode = require('qrcode-terminal');

const { Messages } = require('../../data');
const { MessageMedia } = require('whatsapp-web.js');

const app = new whatsAppWeb.Client({
  authStrategy: new whatsAppWeb.LocalAuth({
    clientId: settings.whatsapp.clientId,
  }),
  ...settings.whatsapp,
});

app.on('loading_screen', (percent, message) => {
  console.log('WhatsApp: LOADING SCREEN', percent, message);
});

/**
 * Time 
 * @param {time} ms 
 * @returns 
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  ...whatsAppWeb,

  app,

  /**
   * Envia mensagens agendados no banco de dados
   * @param {state} state Whatsapp msg
   */
  async sendDB(state) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const { app } = state.whatsapp;
        const msgs = await Messages.findAll({
          where: { group: 'SEND', status: false }
        })
        for (const msg of msgs) {
          try {
            if (msg.hasMedia) {
              const media = new MessageMedia(msg.mimetype, msg.data)
              await app.sendMessage(msg.to, media, { caption: msg.body })
            } else {
              app.sendMessage(msg.to, msg.body);
            }
            await msg.update({ status: 1 })
            await msg.destroy()
          } catch (e) {
            state.logger.error(`Erro ao enviar mensagens para ${msg.tel}: ${e}`);
          }
        }
      } catch (e) {
        console.error(`Erro ao em criar mensagens dos contatos: ${e}`);
      }
      // eslint-disable-next-line no-undef
      await sleep(5000);
    }
  },

  /**
   * Envia mensagem para os Marcadores do Google Contatos utilizando a API
   * @param {state} state Estado da aplicação
   * @param {msg} msg Mensagem do Whatsapp
   * @returns
   */
  async createMsgGoogleGroups(state, msg) {
    const { api } = state;
    try {
      if (msg.fromMe) {
        // API
        if (msg.to === api.id) {
          let isRun = true;
          // Encaminhamento de mensagens nos grupos Google contatos
          const rgEncaminharMensagem = /(send |mensagem |msg )(para |)(.*)$/gi;
          if (msg.body.match(rgEncaminharMensagem)) {
            try {
              isRun = false;
              const { contatos } = state;

              const grupos = state.contatos.groups;
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
                  `Grupo ${grupo || result
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
                api.cmd = () => { };
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
                let data, mimetype;
                // eslint-disable-next-line no-unused-vars
                const { from, to, body, notifyName, self, caption, type, hasMedia } = msg
                if (hasMedia) {
                  const media = await msg.downloadMedia();
                  data = media.data
                  mimetype = media.mimetype
                  // const media2 = new MessageMedia(ds.mimetype, ds.data)
                  // await app.sendMessage('556284972385@c.us', media2, { caption: msg.body })
                }
                for (const el of newContatos) {
                  if (!msg.body.startsWith('API:')) {
                    for (const tel of el.tel) {
                      if (tel && !telSends[tel]) {
                        Messages.create({ from, to: tel, group: 'SEND', body, notifyName, self, caption, mimetype, type, data, hasMedia })
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
              api.cmd = () => { };
              msg.reply(`API: Ok, todos os comandos foram removidos!`);
            }
            if (isRun) {
              api.cmd(msg);
            }
          } catch (e) {
            const ms = `Erro: ${e}`;
            api.cmd = () => { };
            state.logger.error(ms)
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

  /**
   * Responde com o link do whatsapp
   * @param {state} state 
   * @param {msg} msg 
   */
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

  async qrCodeGenrateConsole(state, qr) {
    qrcode.generate(qr, { small: true });
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
      A3.value = `${new Date().toLocaleString()}`;
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
   * @param {state} state Estado da aplicação
   * @param {msg} msg Whatsapp message
   */
  // eslint-disable-next-line require-await
  async AutoSaveGoogleContatos(state, msg) {
    try {
      const contact = await msg.getContact();
      const chat = await msg.getChat();
      const contatos = state.contatos.values;
      // console.log('Contact: ', contact);
      // console.log('Chat: ', chat);

      const isSaved = contatos.find((el) =>
        el._TELEFONES.includes(contact.id._serialized.replace('@c.us', ''))
      );

      if (!isSaved) {
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
      state.logger.log(`Erro AutoSave contatos no google sheets: ${e}`);
    }
  },
  sendMessagesCRON(state) {
    state.logger.log('Cron mensagens');
  },
  /**
   * O usuário saiu ou foi expulso do grupo
   * @param {State} state Estado da aplicação
   * @param {Whatsapp} notification Notification whatsapp
   */
  async groupLeave(state, notification) {
    const { name: chatName } = await notification.getChat();
    const contact = await notification.getContact();
    if (
      [
        'CCB Goiás!',
        'RJM-Cidade de Goiás✅',
        'ADM CCB - Cidade de Goiás',
        'Orquestra Cidade de Goiás',
        'Irmandade Uvá',
        'API',
      ].includes(chatName)
    ) {
      state.api.sendMessage(
        `${contact.name || contact.pushname} (${notification.author.replace('@c.us', '') || ''
        }) ${notification.type} => ${notification.id.participant.replace(
          '@c.us',
          ''
        )} no grupo ${chatName}!`
      );
    }
  },
  /**
   * O usuário adicionado ao grupo
   * @param {State} state Estado da aplicação
   * @param {Whatsapp} notification Notification whatsapp
   */
  async groupJoin(state, notification) {
    const { name: chatName } = await notification.getChat();
    const contact = await notification.getContact();
    if (
      [
        'CCB Goiás!',
        'RJM-Cidade de Goiás✅',
        'ADM CCB - Cidade de Goiás',
        'Orquestra Cidade de Goiás',
        'Irmandade Uvá',
        'API',
      ].includes(chatName)
    ) {
      state.api.sendMessage(
        `${contact.name || contact.pushname} (${notification.author.replace('@c.us', '') || ''
        }) ${notification.type} => ${notification.id.participant.replace(
          '@c.us',
          ''
        )} no grupo ${chatName}!`
      );
      // state.whatsapp.app.sendMessage(
      //   notification.id.participant,
      //   `Seja muito bem vindo ao grupo ${chatName} 😃`
      // );
    }
  },
};

app.initialize();

module.exports = whatsapp;
