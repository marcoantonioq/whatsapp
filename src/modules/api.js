const { app } = require('./whatsapp');

const api = {
  id: '120363042441548855@g.us',
  my: '556284972385@g.us',
  confirmed: true,
  sendMessage(text) {
    app.sendMessage(this.id, `API: ${text}`);
  },
  reply(msg, text) {
    msg.reply(`API: ${text}`);
  },
  cmd() {},
  status: {
    authenticated: false,
    auth_failure: false,
    ready: false,
  },
};

module.exports = api;
