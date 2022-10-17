//index.js
const database = require("./db");
const Messages = require("./messages");
const Contatos = require("./contatos");
const Groups = require("./groups");

database.sync();

const db = {
  database,
  Messages,
  Contatos,
  Groups,
};

module.exports = db;
