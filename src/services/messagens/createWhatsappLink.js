const api = require('../../enums/api');
const phone = require('../../lib/phonenumber');

// eslint-disable-next-line require-await
async function createWhatsappLink(msg) {
  try {
    if (msg.fromMe) {
      // API
      if (msg.to === api.id) {
        // Encaminhamento de mensagens nos grupos Google cotnatos
        const rgEncaminharMensagem = /(wa |whatsapp |link )(.*)$/gi;
        if (msg.body.match(rgEncaminharMensagem)) {
          const result = rgEncaminharMensagem.exec(msg.body)[2].trim();
          msg.reply(
            `API: https://wa.me/${phone
              .format(result.trim())
              .replace(/@.*/gi, ``)} `
          );
        }
      }
    }
  } catch (e) {
    console.log(`Erro: ${e}`);
  }
}

module.exports = {
  createWhatsappLink,
};
