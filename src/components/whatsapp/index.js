/* eslint-disable no-console */
const what = require('whatsapp-web.js');
const settings = require('../../../config/global');
// eslint-disable-next-line no-unused-vars

const app = new what.Client({
  authStrategy: new what.LocalAuth({
    clientId: settings.whatsapp.clientId,
  }),
  ...settings.whatsapp,
});

app.on('loading_screen', (percent, message) => {
  console.log('WhatsApp: LOADING SCREEN', percent, message);
});

app.on('qr', (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log('WhatsApp: QR RECEIVED', qr);
});

app.on('authenticated', () => {
  console.log('WhatsApp: AUTHENTICATED');
});

app.on('auth_failure', (msg) => {
  // Fired if session restore was unsuccessful
  console.error('WhatsApp: AUTHENTICATION FAILURE', msg);
});

app.on('message', async (msg) => {
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
            User name: ${info.pushname}
            My number: ${info.wid.user}
            Platform: ${info.platform}
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
  console.log('join', notification);
  notification.reply('User joined.');
});

app.on('group_leave', (notification) => {
  // User has left or been kicked from the group.
  console.log('leave', notification);
  notification.reply('User left.');
});

app.on('disconnected', (reason) => {
  console.log('WhatsApp: Client was logged out', reason);
});

app.on('ready', () => {
  console.log('WhatsApp: READY');
});

app.initialize();

module.exports = {
  ...what,
  app,
};
