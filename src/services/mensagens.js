const whats = require('../components/whatsapp');
const sheet = require('../components/google/sheets');
const phone = require('../lib/phonenumber');
const { app } = whats;

const my = '556284972385@c.us';
const plan = {
  '120363042441548855@g.us': 'GOI',
  '120363043272286924@g.us': 'UVA',
};

// eslint-disable-next-line require-await
app.on('message', async (msg) => {
  console.log('Nova mensagem recebida: ', msg.body);
  // console.log('Contato: ', await msg.getContact());
});

// eslint-disable-next-line require-await
app.on('message_create', async (msg) => {
  const { fromMe, body } = msg;
  try {
    if (fromMe) {
      if (plan[msg.to]) {
        const contatos = await sheet.getRows(plan[msg.to]);
        contatos
          .map((el) => ({ ...el, tel: phone.format(el._TELEFONE) }))
          .filter((el) => el.tel)
          .forEach(async (el) => {
            if (msg.body.trim()) {
              app.sendMessage(el.tel, await sheet.replaceInRow(body, el));
            } else {
              msg.forward(el.tel);
            }
          });
      }
    }
  } catch (e) {
    app.sendMessage(my, `Erro: ${e}`);
  }
});

module.exports = {
  status: true,
};
