const { createStore } = require('vuex');
const { Message, MessageMedia } = require('whatsapp-web.js');
const { ready, message, create, qrcode } = require('../observers');
const { whatsapp, contatos, logger, api } = require('../modules');
const database = require('./database');

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

const { app, what } = store.state.whatsapp;

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
  if (!msg.body.startsWith('API:')) {
    if (msg.to === store.state.api.id) {
      // if (msg.hasMedia) {
      //   // console.log(`Msg: ${JSON.stringify(msg)}`)
      //   const media = await msg.downloadMedia();
      //   console.log(media)
      //   const ds = JSON.parse(JSON.stringify(media))
      //   const media2 = new MessageMedia(ds.mimetype, ds.data)
      //   await app.sendMessage('556284972385@c.us', media2, { caption: msg.body })
      // }
      // database.msgCreated(msg).then(result => {
      //   console.log(`msg criada salva: ${result}`)
      // }).catch(err => {
      //   console.log("erro: ", err)
      // })
    }
  }


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
  message.notify(store.state, msg);
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
  // store.state.logger.log('READY...');
  store.state.api.status.ready = true;
  ready.notify(store.state);
  const { toSends } = database.data
  console.log(`Mensagens para enviar: ${toSends.length}`)
  // toSends.forEach(async msg => {
  //   if (msg.type === "image") {
  //     var media = await new MessageMedia(msg.mimetype, msg.body, "Aviso")
  //     await app.sendMessage("556284972385@c.us", media, { caption: msg.caption })
  //   }
  //   if (msg.type === "chat") {
  //     await app.sendMessage("556284972385@c.us", msg.body)
  //   }
  //   // await new MessageMedia(msg)
  //   // app.sendMessage(msg)
  // })
});

module.exports = store;
