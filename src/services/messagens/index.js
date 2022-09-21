const whats = require('../../components/whatsapp');
const { createMsgGoogleContacs } = require('./createMsgGoogleContacts');
const { createMsgGoogleGroups } = require('./createMsgGoogleGroups');
const { app } = whats;

createMsgGoogleContacs();

// eslint-disable-next-line require-await
app.on('message', async (msg) => {
  console.log('Nova mensagem recebida: ', msg.body);
  // console.log('Contato: ', await msg.getContact());
});

// eslint-disable-next-line require-await
app.on('message_create', async (msg) => {
  if (msg.body.startsWith('API:')) {
    return true;
  }
  createMsgGoogleGroups(msg);
});

module.exports = {
  status: true,
};
