const sheet = require('../lib/google/sheets');
const store = require('../store');

const contatos = {
  store: [],
  get values() {
    return this.store;
  },
  set values(contact) {
    this.store.push(contact);
  },
  async update() {
    const contatos = await sheet.getValues('Contatos');
    this.store = contatos;
    return this;
  },
  replaceInRow(message, row) {
    try {
      const msg = Object.keys(row)
        .filter((el) => el.match(/^_[a-z]/gi))
        .reduce((acc, coluna) => {
          return acc.replaceAll(
            new RegExp(`${coluna}`, 'gi'),
            `${row[coluna]}`
          );
        }, message);
      return msg.replaceAll(/ _[a-z]+/gi, '');
    } catch (e) {
      console.log('Error convert text: ', e);
      return message.replaceAll(/_[a-z]+/gi, '');
    }
  },
};

contatos.update();
setInterval(contatos.update, 30 * 60 * 1000);

store.commit('contatos', contatos);
module.exports = contatos;
