/**
 * TypeScript message
 * @typedef { import("../store").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 */

const whatsAppWeb = require('whatsapp-web.js');
const globalSettings = require('../../config/global');
const credenciais = require('../../config/credenciais.json');

const app = new whatsAppWeb.Client({
  authStrategy: new whatsAppWeb.LocalAuth({
    clientId: globalSettings.whatsapp.clientId,
  }),
  ...globalSettings.whatsapp,
});

app.addListener('saveMessage', (msg) => {
  console.log('salvando mensagem: ', msg);
});

app.addListener('messageToAPI', (text) => {
  app.sendMessage(credenciais.myPhone, `API: ${text}`);
});

app.initialize();

module.exports = {
  app,
  settings: globalSettings,
  whatsAppWeb,
};
