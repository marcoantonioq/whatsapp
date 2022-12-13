const { app } = require('../modules/whatsapp');

app.on('message', async (msg) => {
  if (msg.body.startsWith('API:')) {
    return true;
  }
});
