const { Sequelize } = require("sequelize");
const database = require("./db");

const Groups = database.define("grupos", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  _GRUPOS: Sequelize.STRING,
  _STATUS: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Groups;
