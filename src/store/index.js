const { createStore } = require('vuex');
const { ready, message, create, qrcode } = require('../observers');

const store = createStore({
  state() {
    const state = {
      count: 0,
      whatsapp: {},
      api: {
        id: '120363042441548855@g.us',
        my: '556284972385@g.us',
        confirmed: true,
        cmd() {},
      },
      status: {
        authenticated: false,
        auth_failure: false,
        ready: false,
      },
      bot: {},
    };
    return state;
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    what_init(state, whatsapp) {
      state.whatsapp = whatsapp;
    },
    qr(state, qr) {
      qrcode.notify(state, qr);
    },
    auth_failure(state) {
      state.status.auth_failure = true;
    },
    authenticated(state) {
      state.status.authenticated = true;
    },
    ready(state) {
      console.log('READY...');
      state.status.ready = true;
      ready.notify(state);
    },
    disconnected(state) {
      state.status.ready = false;
    },
    message(state, msg) {
      message.notify(state, msg);
    },
    message_create(state, msg) {
      try {
        if (msg.body.startsWith('API:')) {
          return true;
        }
        create.notify(state, msg);
      } catch (e) {
        state.api.sendMessage(
          `API: Erro no processamento ao criar mensagem: ${e}`
        );
      }
    },
    cmd(state, cmd) {
      state.api.cmd = cmd;
    },
  },
  getters: {
    counter: (state) => state.count,
  },
  actions: {
    decrement: ({ commit }) => commit('decrement'),
    increment: (context) => context.commit('increment'),
  },
});

module.exports = store;
