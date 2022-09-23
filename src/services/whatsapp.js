/* eslint-disable no-console */
const what = require('whatsapp-web.js');
const settings = require('../../config/global');
const store = require('../store');

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

app.on('qr', (qr) => {
  store.commit('qr', qr);
});

app.on('authenticated', () => {
  store.commit('authenticated');
});

app.on('auth_failure', (msg) => {
  store.commit('auth_failure');
});

app.on('message_create', (msg) => {
  if (msg.body.startsWith('API:')) {
    return true;
  }
  store.commit('message_create', msg);
});

app.on('message', async (msg) => {
  store.commit('message', msg);
  if (msg.body === '!ping reply') {
    msg.reply('pong');
  } else if (msg.body === '!ping') {
    app.sendMessage(msg.from, 'pong');
  } else if (msg.body === '!info') {
    const info = app.info;
    app.sendMessage(
      msg.from,
      `
            *Connection info*
            Nome: ${info.pushname}
            Telefone: ${info.wid.user}
            Plataforma: ${info.platform}
        `
    );
  } else if (msg.body === '!pin') {
    const chat = await msg.getChat();
    await chat.pin();
  } else if (msg.body.startsWith('!echo ')) {
    // Replies with the same message
    msg.reply(msg.body.slice(6));
  } else if (msg.body === '!clearstate') {
    const chat = await msg.getChat();
    // stops typing or recording in the chat
    chat.clearState();
  } else if (msg.body === '!jumpto') {
    if (msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      app.interface.openChatWindowAt(quotedMsg.id._serialized);
    }
  } else if (msg.body === '!buttons') {
    const button = new what.Buttons(
      'Button body',
      [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }],
      'title',
      'footer'
    );
    app.sendMessage(msg.from, button);
  } else if (msg.body === '!list') {
    const sections = [
      {
        title: 'sectionTitle',
        rows: [
          { title: 'ListItem1', description: 'desc' },
          { title: 'ListItem2' },
        ],
      },
    ];
    const list = new what.List(
      'List body',
      'btnText',
      sections,
      'Title',
      'footer'
    );
    app.sendMessage(msg.from, list);
  } else if (msg.body === '!reaction') {
    msg.react('👍');
  }
});

app.on('group_join', (notification) => {
  // User has joined or been added to the group.
  // console.log('join', notification);
  // notification.reply('User joined.');
});

app.on('group_leave', (notification) => {
  // User has left or been kicked from the group.
  // console.log('leave', notification);
  // notification.reply('User left.');
});

app.on('disconnected', (reason) => {
  store.commit('disconnected');
});

app.on('ready', () => {
  store.commit('ready');
});

const whatsapp = {
  ...what,
  app,
};

store.commit('what_init', whatsapp);
module.exports = whatsapp;
