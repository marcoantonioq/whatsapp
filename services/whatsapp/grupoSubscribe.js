const { app } = require('../modules/whatsapp');

/**
 * groupLeave: O usuário saiu ou foi expulso do grupo
 * @param {notification} notification Notification whatsapp
 */
async function subscribe(notification) {
  const { name: chatName } = await notification.getChat();
  const contact = await notification.getContact();
  app.emit(
    'messageToAPI',
    `${contact.name || contact.pushname} (${
      notification.author.replace('@c.us', '') || ''
    }) ${notification.type} => ${notification.id.participant.replace(
      '@c.us',
      ''
    )} no grupo ${chatName}!`
  );
}

app.on('group_join', subscribe);

app.on('group_leave', subscribe);

//   // state.whatsapp.message.subscribe(
//   //   /**
//   //    * AutoSaveGoogleContatos: Salva o contato de novas conversas no Google Sheet
//   //    * @param {msg} msg Whatsapp message
//   //    */
//   //   // eslint-disable-next-line require-await
//   //   async (msg) => {
//   //     try {
//   //       const contact = await msg.getContact();
//   //       const chat = await msg.getChat();
//   //       const contatos = state.contatos.values;
//   //       // console.log('Contact: ', contact);
//   //       // console.log('Chat: ', chat);

//   //       const isSaved = contatos.find((el) =>
//   //         el._TELEFONES.includes(contact.id._serialized.replace('@c.us', ''))
//   //       );

//   //       if (!isSaved) {
//   //         const groups = new Groups();
//   //         const doc = await sheet.getDoc();
//   //         const plan = doc.sheetsByTitle.Save;
//   //         groups.values = 'AutoSave';
//   //         if (chat.isGroup && !phone.format(chat.name)) {
//   //           groups.values = chat.name;
//   //         }
//   //         contatos[contact.id._serialized] = contact.name || contact.pushname;
//   //         plan.addRow({
//   //           Name: contact.name || contact.pushname,
//   //           Birthday: '',
//   //           Notes: contact.pushname,
//   //           'Group Membership': groups.values.join(', '),
//   //           'Phone 1 - Value': contact.number.replace(
//   //             /(\d\d)(\d{8}$)/g,
//   //             '$19$2'
//   //           ),
//   //           'Organization 1 - Name': '',
//   //         });
//   //       }
//   //     } catch (e) {
//   //       state.logger.log(`Erro AutoSave contatos no google sheets: ${e}`);
//   //     }
//   //   }
//   // );

//   state.whatsapp.group.subscribe(
//     /**
//      * groupJoin: O usuário adicionado ao grupo
//      * @param {notification} notification Notification whatsapp
//      */
//     async (notification) => {
//       const { name: chatName } = await notification.getChat();
//       const contact = await notification.getContact();
//       api.sendMessage(
//         `${contact.name || contact.pushname} (${
//           notification.author.replace('@c.us', '') || ''
//         }) ${notification.type} => ${notification.id.participant.replace(
//           '@c.us',
//           ''
//         )} no grupo ${chatName}!`
//       );
//       // state.whatsapp.app.sendMessage(
//       //   notification.id.participant,
//       //   `Seja muito bem vindo ao grupo ${chatName} 😃`
//       // );
//     }
//   );

//   state.whatsapp.ready.subscribe(async () => {
//     console.log('ENVIAR MENSAGEM...');
//     // for (const msg of msgs) {
//     //   try {
//     //     const fone = phone.format(msg.to);
//     //     if (fone) {
//     //       const media = await MessageMedia.fromFilePath('out/media.jpeg');
//     //       await app.sendMessage(fone, media);
//     //     }
//     //   } catch (e) {
//     //     console.log(`to: ${msg.to};\tErro: ${e}`);
//     //   }
//     // }
//   });

//   return {};
// }
