const { createStore } = require('vuex');
const state = require('./state')
const { ready, message, create, qrcode } = require('../observers');
const { whatsapp, contatos, logger, api, db } = require('../modules');

const store = createStore({
  state() {
    return state;
  },
  mutations: {
    contatos(state, contatos) {
      console.log('Contatos alterados: ', state.contatos)
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

const { app } = store.state.whatsapp;

app.on('qr', (qr) => {
  qrcode.notify(store.state, qr);
});

app.on('authenticated', () => {
  store.state.api.status.authenticated = true;
});

app.on('auth_failure', () => {
  store.state.api.status.auth_failure = true;
});

app.on('message_create', async (msg) => {

  try {
    if (msg.body.startsWith('API:')) {
      return true;
    }
    create.notify(store.state, msg);
  } catch (e) {
    store.state.api.sendMessage(
      `Erro no processamento ao criar mensagem: ${e}`
    );
  }
});

app.on('message', async (msg) => {
  if (msg.body.startsWith('API:')) {
    return true;
  }
  message.notify(store.state, msg);
});

app.on('group_join', (notification) => {
  store.state.whatsapp.groupJoin(store.state, notification);
});

app.on('group_leave', (notification) => {
  store.state.whatsapp.groupLeave(store.state, notification);
});

// eslint-disable-next-line no-unused-vars
app.on('disconnected', (_reason) => {
  store.state.api.status.ready = false;
});

app.on('ready', () => {
  ready.notify(store.state);
  store.state.api.status.ready = true;
});

module.exports = store;
