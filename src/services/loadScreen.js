const { app } = require('../modules/whatsapp');

app.on('loading_screen', (percent, message) => {
  console.log('WHATSAPP: LOADING SCREEN', percent, message);
});
