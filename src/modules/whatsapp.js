/**
 * TypeScript message
 * @typedef { import("../store").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 */

const whatsAppWeb = require('whatsapp-web.js');
const settings = require('../../config/global');
const Observable = require('../observers')

function init() {
  const observers = {
    message: new Observable(),
    ready: new Observable(),
    create: new Observable(),
    qrCode: new Observable(),
    group: new Observable(),
    disconnected: new Observable(),
  }
  const app = new whatsAppWeb.Client({
    authStrategy: new whatsAppWeb.LocalAuth({
      clientId: settings.whatsapp.clientId,
    }),
    ...settings.whatsapp,
  });

  app.on('loading_screen', (percent, message) => {
    console.log('WhatsApp: LOADING SCREEN', percent, message);
  });

  app.on('qr', (qr) => {
    observers.qrCode.notify(qr);
  });

  app.on('message_create', async (msg) => {
    try {
      if (msg.body.startsWith('API:')) {
        return true;
      }
      observers.create.notify(msg);
    } catch (e) {
      console.log(`Erro no processamento ao criar mensagem: ${e}`)
    }
  });

  app.on('message', async (msg) => {
    if (msg.body.startsWith('API:')) {
      return true;
    }
    observers.message.notify(msg);
  });

  app.on('group_join', (notification) => {
    observers.group.notify(notification)
  });

  app.on('group_leave', (notification) => {
    observers.group.notify(notification)
  });

  app.on('disconnected', (reason) => {
    observers.disconnected.notify(reason)
  });

  app.on('ready', () => {
    observers.ready.notify();
  });

  new Promise(function (resolve, reject) {
    try {
      app.initialize()
      resolve('init')
    } catch (e) {
      reject(Error(`Erro: ${e}`));
    }
  })

  return {
    ...whatsAppWeb,
    ...observers,
    app,
  };
}

module.exports = init;
