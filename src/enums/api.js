const whats = require('../components/whatsapp');

const api = {
  id: '120363042441548855@g.us',
  confirmed: true,
  sendMessage(text) {
    whats.app.sendMessage(this.id, `API: ${text}`);
  },
  reply(msg, text) {
    msg.reply(`API: ${text}`);
  },
  cmd(_msg) {},
};

module.exports = api;
