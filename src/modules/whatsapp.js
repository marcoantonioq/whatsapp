/**
 * TypeScript message
 * @typedef { import("../store").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 */

const whatsAppWeb = require('whatsapp-web.js');
const settings = require('../../config/global');

const app = new whatsAppWeb.Client({
  authStrategy: new whatsAppWeb.LocalAuth({
    clientId: settings.whatsapp.clientId,
  }),
  ...settings.whatsapp,
});

app.addListener('saveMessage', (msg) => {
  console.log('salvando mensagem: ', msg);
});

app.initialize();

module.exports = {
  app,
  settings,
  whatsAppWeb,
};
