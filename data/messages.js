const { Sequelize } = require('sequelize');
const database = require('./db');

const Messages = database.define('messages', {
    id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
    from: { type: Sequelize.STRING, allowNull: false },
    to: { type: Sequelize.STRING, allowNull: false },
    body: { type: Sequelize.STRING },
    group: Sequelize.STRING,
    notifyName: Sequelize.STRING,
    self: Sequelize.STRING,
    caption: Sequelize.STRING,
    mimetype: Sequelize.STRING,
    type: Sequelize.STRING,
    data: Sequelize.STRING,
    old: Sequelize.STRING,
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    hasMedia: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})

module.exports = Messages;