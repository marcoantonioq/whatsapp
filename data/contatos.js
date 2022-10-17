const { Sequelize } = require("sequelize");
const database = require("./db");

const Contatos = database.define("contatos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  _NOME: { type: Sequelize.STRING, allowNull: false },
  _NOTAS: Sequelize.STRING,
  _TELEFONES: Sequelize.STRING,
  _DATES: Sequelize.STRING,
  _GRUPOS: Sequelize.STRING,
  _ADDRESS: Sequelize.STRING,
  _ID: Sequelize.STRING,
  _STATUS: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Contatos;
