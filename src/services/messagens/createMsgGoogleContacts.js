const whats = require('../../components/whatsapp');
const sheet = require('../../components/google/sheets');
const phone = require('../../lib/phonenumber');
const { app } = whats;

/**
 * Função setInterval
 * @param {Whatsapp} msg Whatsapp msg
 */
// eslint-disable-next-line require-await
async function createMsgGoogleContacs(msg) {
  const myInterval = setInterval(async () => {
    try {
      const contatos = await sheet.getRows('Contatos');
      contatos
        .filter((el) => el._MSG)
        .forEach((el) => {
          el._TELEFONES
            .split(',')
            .map((tel) => phone.format(tel.trim()))
            .forEach(async (tel) => {
              app.sendMessage(tel, await sheet.replaceInRow(el._MSG, el));
              el._MSG = '';
              el.save();
            });
        });
    } catch (e) {
      console.log(`Erro: ${e}`);
      clearInterval(myInterval);
    }
  }, 5 * 60 * 1000);
}

module.exports = {
  createMsgGoogleContacs,
};
