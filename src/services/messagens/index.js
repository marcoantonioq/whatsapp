const whats = require('../../components/whatsapp');
const api = require('../../enums/api');
const { AutoSaveGoogleContatos } = require('./AutoSaveContact');
const { createMsgGoogleContacs } = require('./createMsgGoogleContacts');
const { createMsgGoogleGroups } = require('./createMsgGoogleGroups');
const { createWhatsappLink } = require('./createWhatsappLink');
const { app } = whats;

createMsgGoogleContacs();

// eslint-disable-next-line require-await
app.on('message', async (msg) => {
  try {
    console.log('Nova mensagem recebida: ', msg.body);
    AutoSaveGoogleContatos(msg);
  } catch (e) {
    api.send(`Erro no processamento de mensagem recebidas: ${e}`);
  }
});

// eslint-disable-next-line require-await
app.on('message_create', async (msg) => {
  try {
    if (msg.body.startsWith('API:')) {
      return true;
    }
    createMsgGoogleGroups(msg);
    createWhatsappLink(msg);
  } catch (e) {
    api.send(`Erro no processamento ao criar mensagem: ${e}`);
  }
});

module.exports = {
  status: true,
};
