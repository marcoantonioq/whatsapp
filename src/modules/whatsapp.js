/* eslint-disable no-console */
const what = require('whatsapp-web.js');
const settings = require('../../config/global');

const app = new what.Client({
  authStrategy: new what.LocalAuth({
    clientId: settings.whatsapp.clientId,
  }),
  ...settings.whatsapp,
});

app.initialize();

app.on('loading_screen', (percent, message) => {
  console.log('WhatsApp: LOADING SCREEN', percent, message);
});

const whatsapp = {
  ...what,
  app,
};

module.exports = whatsapp;
