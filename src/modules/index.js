const whatsapp = require('./whatsapp');
const contatos = require('./contatos');
const logger = require('./logger');
const db = require('../../data')

module.exports = {
  whatsapp,
  contatos,
  logger,
  db
};
