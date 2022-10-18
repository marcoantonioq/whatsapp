const { createStore } = require('vuex');
const { whatsapp, contatos, logger, db } = require('../modules');

require('../services/whatsapp');

const store = createStore({
  state() {
    const state = {
      count: 0,
      logger,
      contatos,
      whatsapp: whatsapp(this),
      db,
    };
    return state;
  },
  mutations: {
    contatos(state, contatos) {
      console.log('Contatos alterados: ', state.contatos);
      state.contatos = contatos;
    },
  },
  getters: {
    contatos: (state) => state.contatos,
  },
  actions: {
    decrement: ({ commit }) => commit('decrement'),
    increment: (context) => context.commit('increment'),
  },
});

module.exports = store;
