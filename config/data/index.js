//index.js
const database = require('./db');
const Messages = require('./messages');

database.sync();

// const resultadoCreate = Messages.create({
//     from: 'from',
//     to: 'to',
//     body: 'Texto body'
// })
// console.log(resultadoCreate);

module.exports = {
    database, Messages
}