const { createStore } = require('vuex');
const { ready, message, create, qrcode } = require('../observers');
const { whatsapp, contatos, logger, api } = require('../modules');

const store = createStore({
  state() {
    const state = {
      count: 0,
      logger,
      contatos,
      whatsapp,
      api,
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
      state.api.status.auth_failure = true;
    },
    authenticated(state) {
      state.api.status.authenticated = true;
    },
    ready(state) {
      state.logger.log('READY...');
      state.api.status.ready = true;
      ready.notify(state);
    },
    disconnected(state) {
      state.api.status.ready = false;
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
        state.api.sendMessage(`Erro no processamento ao criar mensagem: ${e}`);
      }
    },
    cmd(state, cmd) {
      state.api.cmd = cmd;
    },
    contatos(state, contatos) {
      state.contatos = contatos;
    },
    logger(state, logger) {
      state.logger = logger;
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

const { app, what } = store.state.whatsapp;

app.on('qr', (qr) => {
  store.commit('qr', qr);
});

app.on('authenticated', () => {
  store.commit('authenticated');
});

app.on('auth_failure', (msg) => {
  store.commit('auth_failure');
});

app.on('message_create', (msg) => {
  if (msg.body.startsWith('API:')) {
    return true;
  }
  store.commit('message_create', msg);
});

app.on('message', async (msg) => {
  store.commit('message', msg);
  if (msg.body === '!ping reply') {
    msg.reply('pong');
  } else if (msg.body === '!ping') {
    app.sendMessage(msg.from, 'pong');
  } else if (msg.body === '!info') {
    const info = app.info;
    app.sendMessage(
      msg.from,
      `
            *Connection info*
            Nome: ${info.pushname}
            Telefone: ${info.wid.user}
            Plataforma: ${info.platform}
        `
    );
  } else if (msg.body === '!pin') {
    const chat = await msg.getChat();
    await chat.pin();
  } else if (msg.body.startsWith('!echo ')) {
    // Replies with the same message
    msg.reply(msg.body.slice(6));
  } else if (msg.body === '!clearstate') {
    const chat = await msg.getChat();
    // stops typing or recording in the chat
    chat.clearState();
  } else if (msg.body === '!jumpto') {
    if (msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      app.interface.openChatWindowAt(quotedMsg.id._serialized);
    }
  } else if (msg.body === '!buttons') {
    const button = new what.Buttons(
      'Button body',
      [{ body: 'bt1' }, { body: 'bt2' }, { body: 'bt3' }],
      'title',
      'footer'
    );
    app.sendMessage(msg.from, button);
  } else if (msg.body === '!list') {
    const sections = [
      {
        title: 'sectionTitle',
        rows: [
          { title: 'ListItem1', description: 'desc' },
          { title: 'ListItem2' },
        ],
      },
    ];
    const list = new what.List(
      'List body',
      'btnText',
      sections,
      'Title',
      'footer'
    );
    app.sendMessage(msg.from, list);
  } else if (msg.body === '!reaction') {
    msg.react('👍');
  }
});

app.on('group_join', (notification) => {
  // User has joined or been added to the group.
  // console.log('join', notification);
  // notification.reply('User joined.');
});

app.on('group_leave', (notification) => {
  // User has left or been kicked from the group.
  // console.log('leave', notification);
  // notification.reply('User left.');
});

app.on('disconnected', (reason) => {
  store.commit('disconnected');
});

app.on('ready', () => {
  store.commit('ready');
});

module.exports = store;
