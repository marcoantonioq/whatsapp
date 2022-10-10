const whatsapp = require('./whatsapp');
const contatos = require('./contatos');
const logger = require('./logger');
const api = require('./api');
const db = require('../../data')

module.exports = {
  whatsapp,
  contatos,
  logger,
  api,
  db
};
