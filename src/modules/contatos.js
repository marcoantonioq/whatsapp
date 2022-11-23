const { Contatos, Groups } = require('../../data');
const sequelize = require('../../data/db');
const sheet = require('../lib/google-sheets');
const logger = require('./logger');

const contatos = {
  store: [],
  rows: [],
  groups: [],
  get values() {
    try {
      const headerValues = this.rows[0]._sheet.headerValues;
      return this.rows.map(({ _rawData }) => {
        const entries = _rawData.map((val, id) => {
          return [headerValues[id], val];
        });
        const data = new Map(entries);
        return Object.fromEntries(data);
      });
    } catch (e) {
      return this.store;
    }
  },
  set values(contact) {
    this.store.push(contact);
  },
  async update() {
    try {
      console.log('Atualizar Contatos!!!');
      const contatos = await sheet.getValues('Contatos');
      this.store = contatos;
      const rows = await sheet.getRows('Contatos');
      this.rows = rows;
      const groups = await sheet.getRows('Grupos');
      this.groups = groups;
      if (
        (!this.store && this.store.length < 1) ||
        (!this.groups && this.groups.length < 1)
      ) {
        throw 'Contatos ou Grupos inválidos!';
      }
      const t = await sequelize.transaction();
      await Contatos.destroy({ where: {}, truncate: true, transaction: t });
      for (const contato of contatos) {
        await Contatos.create(contato, { transaction: t });
      }
      await Groups.destroy({ where: {}, truncate: true, transaction: t });
      for (const group of groups) {
        await Groups.create(group, { transaction: t });
      }
      await t.commit();
    } catch (e) {
      console.log('Erro ao atualizar contatos: ', e);
      this.store = await Contatos.findAll({ raw: true });
      this.groups = await Groups.findAll({ raw: true });
      logger.error(`Erro ao atualizar contatos: ${e}`);
    }
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
setInterval(contatos.update, 12 * 60 * 60 * 1000);

module.exports = contatos;
