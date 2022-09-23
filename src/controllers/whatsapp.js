// const whats = require('../services/whatsapp');
// const phone = require('../lib/phonenumber');
// const google = require('./lib/google');

exports.index = (req, res) => {
  res.json({
    status: 'Sucesso',
    message: 'A lista...',
    data: [],
  });
};

exports.send = async (req, res) => {
  // const { tel, msg } = req.body;
  // try {
  //   await whats.app.sendMessage(phone.format(tel), msg);
  // } catch (e) {
  //   console.log('Whatsapp não inicializado!');
  // }
  // res.json({
  //   status: 'Sucesso',
  //   message: 'A lista...',
  //   data: [],
  // });
};

// const msg = `A paz de Deus 😃

// *Hoje 09/09* às 19h30 teremos reunião de evangelização na casa do Irmão *Sebastião*, no Jardim das Acácias
//     - Local: https://maps.app.goo.gl/4Dw4WdzMsiiVprTn8

// Deus abençoe 😃🙏`;

// google(whats, msg);
