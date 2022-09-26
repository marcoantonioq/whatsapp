const sheet = require('../lib/google/sheets');
const store = require('../store');

const contatos = {
  store: [],
  rows: [],
  groups: [],
  get values() {
    const headerValues = this.rows[0]._sheet.headerValues;
    return this.rows.map(({ _rawData }) => {
      const entries = _rawData.map((val, id) => {
        return [headerValues[id], val];
      });
      const data = new Map(entries);
      return Object.fromEntries(data);
    });
  },
  set values(contact) {
    this.store.push(contact);
  },
  async update() {
    const contatos = await sheet.getValues('Contatos');
    this.store = contatos;
    const rows = await sheet.getRows('Contatos');
    this.rows = rows;
    const groups = await sheet.getRows('Grupos');
    this.groups = groups;
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
