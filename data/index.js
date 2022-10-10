//index.js
const database = require('./db');
const Messages = require('./messages');

database.sync();

const db = {
    database,
    Messages,
}

// const resultadoCreate = Messages.create({
//     from: 'from',
//     to: 'to',
//     body: 'Texto body'
// })
// console.log(resultadoCreate);

module.exports = db