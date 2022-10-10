const { whatsapp, contatos, logger, api, db } = require('../modules');

/**
 * TypeScript message
 * @typedef { import("./state").state } state
 */

const state = {
    count: 0,
    logger,
    contatos,
    whatsapp,
    api,
    db,
};


/**
 * Teste
 * @param {state} state 
 */
function teste(state) {
    // state.contatos.store[0].
    // states
}

module.exports = state