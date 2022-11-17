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
  //   state.logger.log('Whatsapp não inicializado!');
  // }
  // res.json({
  //   status: 'Sucesso',
  //   message: 'A lista...',
  //   data: [],
  // });
};

