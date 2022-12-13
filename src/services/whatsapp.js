/**
 * TypeScript message
 * @typedef { import("../store/index").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 * @typedef { import("whatsapp-web.js").GroupNotification } notification
 */

const { app } = require("../modules/whatsapp");
// const sheet = require('../lib/google-sheets');
// const phone = require('../lib/phonenumber');
// const msgs = require('./msg');

const db = require("../../data");
// const { MessageMedia } = require('whatsapp-web.js');

/**
 * Time
 * @param {time} ms
 * @returns
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

/**
 * API
 * @param {state} state
 * @returns Object
 */
const factoryAPI = (state) => {
  return {
    id: "120363042441548855@g.us",
    my: "556284972385@g.us",
    confirmed: true,
    sendMessage(text) {
      state.whatsapp.app.sendMessage(this.id, `api: ${text}`);
    },
    reply(msg, text) {
      msg.reply(`API: ${text}`);
    },
    cmd() {},
    status: {
      authenticated: false,
      auth_failure: false,
      ready: false,
    },
  };
};

// /**
//  * Inicializar serviços do WhatsApp
//  * @param {state} state
//  */
// function init(state) {
//   const api = factoryAPI(state);
//   const { app } = state.whatsapp;

//   console.log('Iniciando serviços de WhatsApp...');

//   state.whatsapp.ready.subscribe(async () => {
//     console.log('API: READY...');
//     await sleep(20000);

//     db.Messages.create({ to: api.id, group: 'SEND', body: 'API: READY...' });
//     try {
//       const allChats = await state.whatsapp.app.getChats();
//       const chatFilter = allChats.filter(
//         (el) =>
//           el.id._serialized ==
//           'true_120363042441548855@g.us_3EB0E64264BC2FE015B4_556284972385@c.us'
//       );
//       console.log(chatFilter);
//     } catch (e) {
//       console.error(e);
//     }
//     // eslint-disable-next-line no-constant-condition
//     while (true) {
//       // eslint-disable-next-line no-undef
//       try {
//         const { app } = state.whatsapp;
//         const msgs = await db.Messages.findAll({
//           where: { group: 'SEND', status: false },
//         });
//         for (const msg of msgs) {
//           try {
//             let ms;
//             if (msg.hasMedia) {
//               const media = new MessageMedia(msg.mimetype, msg.data);
//               if (msg.type === 'ptt') {
//                 ms = await app.sendMessage(msg.to, media, {
//                   sendAudioAsVoice: true,
//                 });
//               } else if (msg.type === 'image') {
//                 ms = await app.sendMessage(msg.to, media, {
//                   caption: msg.body,
//                 });
//               }
//             } else {
//               ms = await app.sendMessage(msg.to, msg.body);
//             }
//             // await msg.update({ status: 1, serialized: ms?.id._serialized });
//             await msg.destroy();
//           } catch (e) {
//             state.logger.error(
//               `Erro ao enviar mensagens para ${msg.tel}: ${e}`
//             );
//           }
//         }
//       } catch (e) {
//         state.logger.error(`Erro ao criar mensagens dos contatos: ${e}`);
//       }
//     }
//   });

//   state.whatsapp.create.subscribe(
//     /**
//      * createMsgGoogleGroups: Envia mensagem para os Marcadores do Google Contatos utilizando a API
//      * @param {msg} msg Mensagem do WhatsApp
//      * @returns
//      */
//     async (msg) => {
//       try {
//         if (msg.fromMe) {
//           // API
//           if (msg.to === api.id) {
//             let isRun = true;
//             // Encaminhamento de mensagens nos grupos Google contatos
//             const rgEncaminharMensagem =
//               /(send |mensagem |msg )(para |)(.*)$/gi;
//             if (msg.body.match(rgEncaminharMensagem)) {
//               try {
//                 isRun = false;
//                 const { contatos } = state;

//                 const gpInformado = rgEncaminharMensagem
//                   .exec(msg.body)[3]
//                   .trim()
//                   .split(',')
//                   .map((el) => el.trim().toUpperCase());
//                 const grupos = state.contatos.groups
//                   .filter((el) =>
//                     gpInformado.some((gp) =>
//                       regex(gp)(el._GRUPOS.toUpperCase())
//                     )
//                   )
//                   .map((el) => el._GRUPOS);
//                 const notGrupos = state.contatos.groups
//                   .filter((el) =>
//                     gpInformado.some((gp) => {
//                       if (gp.startsWith('!')) {
//                         return regex(gp.replace(/^!/g, ''))(
//                           el._GRUPOS.toUpperCase()
//                         );
//                       }
//                       return false;
//                     })
//                   )
//                   .map((el) => el._GRUPOS);

//                 console.log('Grupos ignorados: ', notGrupos);
//                 if (!grupos || isEmpty(grupos.join(''))) {
//                   api.reply(
//                     msg,
//                     `Grupo ${gpInformado.join(
//                       ', '
//                     )} inválido! \nGrupos disponíveis: ${state.contatos.groups
//                       .map((el) => el._GRUPOS)
//                       .join(', ')}`
//                   );
//                   return false;
//                 }
//                 setTimeout(() => {
//                   api.reply(
//                     msg,
//                     `Paramos encaminhar msg para ${grupos.join(', ')} `
//                   );
//                   api.cmd = () => {};
//                 }, 5 * 60 * 1000);
//                 const newContatos = contatos.values
//                   .filter((el) => grupos.some((gp) => regex(gp)(el._GRUPOS)))
//                   .filter(
//                     (el) => !notGrupos.some((gp) => regex(gp)(el._GRUPOS))
//                   )
//                   .map((el) => {
//                     return {
//                       ...el,
//                       tel: el._TELEFONES
//                         .split(',')
//                         .map((el) => phone.format(el)),
//                     };
//                   })
//                   .filter((el) => el._NOME && el.tel.length > 0);

//                 // console.log("Contatos", newContatos);

//                 if (newContatos.length === 0) {
//                   api.reply(
//                     msg,
//                     `Nenhum contato para o grupo ${grupos.join(', ')}!`
//                   );
//                   return false;
//                     `Nenhum contato para o grupo ${grupos.join(', ')}!`
//                   );
//                   return false;
//                 }
//                 api.reply(
//                   msg,
//                   `Ok, encaminharemos novas mensagens para ${grupos.join(
//                     ', '
//                   )} com ${
//                     newContatos.length
//                   } participantes! \n\n *Sair: (ok/sair)*`
//                 );

//                 api.reply(
//                   msg,
//                   `Participantes: ${newContatos
//                     .map((el) => el._NOME)
//                     .join(', ')}! \n\n *Sair: (ok/sair)*`
//                 );

//                 /**
//                  * Funtion
//                  * @param {msg} msg
//                  */
//                 // eslint-disable-next-line require-await
//                 api.cmd = async function (msg) {
//                   const telSends = {};
//                   let data, mimetype;
//                   // eslint-disable-next-line no-unused-vars
//                   const {
//                     from,
//                     body,
//                     notifyName,
//                     self,
//                     caption,
//                     type,
//                     hasMedia,
//                   } = msg;
//                   if (hasMedia) {
//                     const media = await msg.downloadMedia();
//                     data = media.data;
//                     mimetype = media.mimetype;
//                   }
//                   for (const el of newContatos) {
//                     if (!msg.body.startsWith('API:')) {
//                       const ms = Object.keys(el)
//                         .filter((el) => el.match(/^_[a-z]/gi))
//                         .reduce((acc, coluna) => {
//                           return acc.replaceAll(
//                             new RegExp(`${coluna}`, 'gi'),
//                             `${el[coluna]}`
//                           );
//                         }, body);
//                       for (const tel of el.tel) {
//                         if (tel && !telSends[tel]) {
//                 const date = new Date().toISOString();           db.Messages.create({
//                             from,
//                             to: tel,
//                             group: 'SEND',
//                             body: ms,
//                             notifyName,
//                             self,
//                             caption,
//                             mimetype,
//                             type,
//                             data,
//                             hasMedia,
//                           });
//                         }
//                         telSends[tel] = msg.body;
//                       }
//                     }
//                   }
//                 };
//               } catch (e) {
//                 isRun = false;
//                 const ms = `Erro ao processar mensagem: ${e}`;
//                 state.logger.error(ms);
//                 api.sendMessage(ms);
//               }
//             }
//             try {
//               if (
//                 msg.body.trim().match(/^(ok|ok!|finalizar|cancelar|sair)$/gi)
//               ) {
//                 api.cmd = () => {};
//                 api.reply(msg, `Ok, todos os comandos foram removidos!`);
//               }
//               if (isRun) {
//                 api.cmd(msg);
//               }
//             } catch (e) {
//               const ms = `Erro: ${e}`;
//               api.cmd = () => {};
//               state.logger.error(ms);
//               api.sendMessage(ms);
//             }
//           }
//         }
//       } catch (e) {
//         const ms = `Erro: send Group: ${e}`;
//         state.logger.error(ms);
//         api.sendMessage(ms);
//       }
//     }  const date = new Date().toISOString();
//     // eslint-disable-next-line require-await
//     async (msg) => {
//       console.log(msg.to, msg.body);
//       try {
//         if (msg.fromMe) {
//           if (msg.to === api.id) {
//             const contact = phone.format(msg.body);
//             if (contact) {
//               api.reply(msg, `https://wa.me/${contact.replace(/@.*/gi, '')} `);
//             }
//           }
//         }
//       } catch (e) {
//         const ms = `Erro whatsAppLink: ${e}`;
//         state.logger.error(ms);
//         api.sendMessage(ms);
//       }
//     }
//   );
