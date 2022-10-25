/**
 * TypeScript message
 * @typedef { import("../store/index").state } state
 * @typedef { import("whatsapp-web.js").Message } msg
 * @typedef { import("whatsapp-web.js").GroupNotification } notification
 */

const sheet = require("../lib/google-sheets");
const phone = require("../lib/phonenumber");
const qrConsole = require("qrcode-terminal");
const msgs = require("./msg");

const db = require("../../data");
const { MessageMedia } = require("whatsapp-web.js");

/**
 * Time
 * @param {time} ms
 * @returns
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Criar uma regex
 * @param {String} regex
 * @returns function
 */
const regex = (regex) => {
  return (text) => {
    return new RegExp(regex, "gi").exec(text);
  };
};

/**
 * É vazio
 * @param {String} str
 * @returns Boolean
 */
function isEmpty(str) {
  return !str || str.length === 0;
}

class Groups {
  constructor(storage) {
    this.storage = storage || [];
  }

  set values(str) {
    if (str) this.storage.push(str);
  }

  get values() {
    return this.storage;
  }
}

/**
 * API
 * @param {state} state
 * @returns Object
 */
const factoryAPI = (state) => {
  return {
    id: "120363042441548855@g.us",
    my: "556284972385@g.us",
    confirmed: true,
    sendMessage(text) {
      state.whatsapp.app.sendMessage(this.id, `API: ${text}`);
    },
    reply(msg, text) {
      msg.reply(`API: ${text}`);
    },
    cmd() {},
    status: {
      authenticated: false,
      auth_failure: false,
      ready: false,
    },
  };
};

/**
 * Inicializar serviços do WhatsApp
 * @param {state} state
 */
function init(state) {
  const api = factoryAPI(state);
  const { app } = state.whatsapp;

  console.log("Iniciando serviços de WhatsApp...");

  state.whatsapp.ready.subscribe(async () => {
    console.log("READY...");
    await sleep(5000);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-undef
      try {
        const { app } = state.whatsapp;
        const msgs = await db.Messages.findAll({
          where: { group: "SEND", status: false },
        });
        for (const msg of msgs) {
          try {
            if (msg.hasMedia) {
              if (msg.type === "ptt") {
                const media = new MessageMedia(msg.mimetype, msg.data);
                await app.sendMessage(msg.to, media, {
                  sendAudioAsVoice: true,
                });
              } else {
                const media = new MessageMedia(msg.mimetype, msg.data);
                await app.sendMessage(msg.to, media, { caption: msg.body });
              }
            } else {
              app.sendMessage(msg.to, msg.body);
            }
            // await msg.update({ status: 1 })
            await msg.destroy();
          } catch (e) {
            state.logger.error(
              `Erro ao enviar mensagens para ${msg.tel}: ${e}`
            );
          }
        }
      } catch (e) {
        state.logger.error(`Erro ao criar mensagens dos contatos: ${e}`);
      }
    }
  });

  state.whatsapp.create.subscribe(
    /**
     * createMsgGoogleGroups: Envia mensagem para os Marcadores do Google Contatos utilizando a API
     * @param {msg} msg Mensagem do WhatsApp
     * @returns
     */
    async (msg) => {
      try {
        if (msg.fromMe) {
          // API
          if (msg.to === api.id) {
            let isRun = true;
            // Encaminhamento de mensagens nos grupos Google contatos
            const rgEncaminharMensagem =
              /(send |mensagem |msg )(para |)(.*)$/gi;
            if (msg.body.match(rgEncaminharMensagem)) {
              try {
                isRun = false;
                const { contatos } = state;

                const gpInformado = rgEncaminharMensagem
                  .exec(msg.body)[3]
                  .trim()
                  .split(",")
                  .map((el) => el.trim().toUpperCase());
                const grupos = state.contatos.groups
                  .filter((el) =>
                    gpInformado.some((gp) =>
                      regex(gp)(el._GRUPOS.toUpperCase())
                    )
                  )
                  .map((el) => el._GRUPOS);
                if (!grupos || isEmpty(grupos.join(""))) {
                  api.reply(
                    msg,
                    `Grupo ${gpInformado.join(
                      ", "
                    )} inválido! \nGrupos disponíveis: ${state.contatos.groups
                      .map((el) => el._GRUPOS)
                      .join(", ")}`
                  );
                  return false;
                }
                setTimeout(() => {
                  api.reply(
                    msg,
                    `Paramos encaminhar msg para ${grupos.join(", ")} `
                  );
                  api.cmd = () => {};
                }, 5 * 60 * 1000);
                const newContatos = contatos.values
                  .filter((el) => grupos.some((gp) => regex(gp)(el._GRUPOS)))
                  .map((el) => {
                    return {
                      ...el,
                      tel: el._TELEFONES
                        .split(",")
                        .map((el) => phone.format(el)),
                    };
                  })
                  .filter((el) => el._NOME && el.tel.length > 0);

                // console.log("Contatos", newContatos);

                if (newContatos.length === 0) {
                  api.reply(
                    msg,
                    `Nenhum contato para o grupo ${grupos.join(", ")}!`
                  );
                  return false;
                }
                api.reply(
                  msg,
                  `Ok, encaminharemos novas mensagens para ${grupos.join(
                    ", "
                  )} com ${
                    newContatos.length
                  } participantes! \n\n *Sair: (ok/sair)*`
                );

                api.reply(
                  msg,
                  `API: participantes ${newContatos
                    .map((el) => el._NOME)
                    .join(", ")}! \n\n *Sair: (ok/sair)*`
                );

                // eslint-disable-next-line require-await
                api.cmd = async function (msg) {
                  const telSends = {};
                  let data, mimetype;
                  // eslint-disable-next-line no-unused-vars
                  const {
                    from,
                    body,
                    notifyName,
                    self,
                    caption,
                    type,
                    hasMedia,
                  } = msg;
                  if (hasMedia) {
                    const media = await msg.downloadMedia();
                    data = media.data;
                    mimetype = media.mimetype;
                  }
                  for (const el of newContatos) {
                    if (!msg.body.startsWith("API:")) {
                      for (const tel of el.tel) {
                        if (tel && !telSends[tel]) {
                          db.Messages.create({
                            from,
                            to: tel,
                            group: "SEND",
                            body,
                            notifyName,
                            self,
                            caption,
                            mimetype,
                            type,
                            data,
                            hasMedia,
                          });
                        }
                        telSends[tel] = msg.body;
                      }
                    }
                  }
                };
              } catch (e) {
                isRun = false;
                const ms = `Erro ao processar mensagem: ${e}`;
                state.logger.error(ms);
                api.sendMessage(ms);
              }
            }
            try {
              if (
                msg.body.trim().match(/^(ok|ok!|finalizar|cancelar|sair)$/gi)
              ) {
                api.cmd = () => {};
                api.reply(msg, `Ok, todos os comandos foram removidos!`);
              }
              if (isRun) {
                api.cmd(msg);
              }
            } catch (e) {
              const ms = `Erro: ${e}`;
              api.cmd = () => {};
              state.logger.error(ms);
              api.sendMessage(ms);
            }
          }
        }
      } catch (e) {
        const ms = `Erro: send Group: ${e}`;
        state.logger.error(ms);
        api.sendMessage(ms);
      }
    }
  );

  state.whatsapp.create.subscribe(
    /**
     * createWhatsappLink: Responde com o link do whatsapp
     * @param {msg} msg
     */
    // eslint-disable-next-line require-await
    async (msg) => {
      console.log(msg.to, msg.body);
      try {
        if (msg.fromMe) {
          if (msg.to === api.id) {
            const contact = phone.format(msg.body);
            if (contact) {
              api.reply(msg, `https://wa.me/${contact.replace(/@.*/gi, "")} `);
            }
          }
        }
      } catch (e) {
        const ms = `Erro whatsAppLink: ${e}`;
        state.logger.error(ms);
        api.sendMessage(ms);
      }
    }
  );

  state.whatsapp.qrCode.subscribe(
    /**
     * qrCodeGenrateConsole
     * @param {String} qr
     */
    async (qr) => {
      qrConsole.generate(qr, { small: true });
    }
  );

  state.whatsapp.qrCode.subscribe(
    /**
     * saveQRGoogleSheet
     * @param {qr} qr
     */
    async (qr) => {
      try {
        const doc = await sheet.getDoc();
        const plan = doc.sheetsByTitle.Whatsapp;
        await plan.loadCells("A1:A3");
        const A2 = plan.getCellByA1("A2");
        A2.value = `=image("https://image-charts.com/chart?chs=500x500&cht=qr&choe=UTF-8&chl="&ENCODEURL("${qr}"))`;
        A2.save();
        const A3 = plan.getCellByA1("A3");
        A3.value = `${new Date().toLocaleString()}`;
        A3.save();
      } catch (e) {
        const ms = `Erro saveQRCode: ${e}`;
        state.logger.error(ms);
        api.sendMessage(ms);
      }
    }
  );

  state.whatsapp.message.subscribe(
    /**
     * AutoSaveGoogleContatos: Salva o contato de novas conversas no Google Sheet
     * @param {msg} msg Whatsapp message
     */
    // eslint-disable-next-line require-await
    async (msg) => {
      try {
        const contact = await msg.getContact();
        const chat = await msg.getChat();
        const contatos = state.contatos.values;
        // console.log('Contact: ', contact);
        // console.log('Chat: ', chat);

        const isSaved = contatos.find((el) =>
          el._TELEFONES.includes(contact.id._serialized.replace("@c.us", ""))
        );

        if (!isSaved) {
          const groups = new Groups();
          const doc = await sheet.getDoc();
          const plan = doc.sheetsByTitle.Save;
          groups.values = "AutoSave";
          if (chat.isGroup && !phone.format(chat.name)) {
            groups.values = chat.name;
          }
          contatos[contact.id._serialized] = contact.name || contact.pushname;
          plan.addRow({
            Name: contact.name || contact.pushname,
            Birthday: "",
            Notes: contact.pushname,
            "Group Membership": groups.values.join(", "),
            "Phone 1 - Value": contact.number.replace(
              /(\d\d)(\d{8}$)/g,
              "$19$2"
            ),
            "Organization 1 - Name": "",
          });
        }
      } catch (e) {
        state.logger.log(`Erro AutoSave contatos no google sheets: ${e}`);
      }
    }
  );

  state.whatsapp.group.subscribe(
    /**
     * groupLeave: O usuário saiu ou foi expulso do grupo
     * @param {notification} notification Notification whatsapp
     */
    async (notification) => {
      const { name: chatName } = await notification.getChat();
      const contact = await notification.getContact();
      if (
        [
          "CCB Goiás!",
          "RJM-Cidade de Goiás✅",
          "ADM CCB - Cidade de Goiás",
          "Orquestra Cidade de Goiás",
          "Irmandade Uvá",
          "API",
        ].includes(chatName)
      ) {
        api.sendMessage(
          `${contact.name || contact.pushname} (${
            notification.author.replace("@c.us", "") || ""
          }) ${notification.type} => ${notification.id.participant.replace(
            "@c.us",
            ""
          )} no grupo ${chatName}!`
        );
      }
    }
  );

  state.whatsapp.group.subscribe(
    /**
     * groupJoin: O usuário adicionado ao grupo
     * @param {notification} notification Notification whatsapp
     */
    async (notification) => {
      const { name: chatName } = await notification.getChat();
      const contact = await notification.getContact();
      if (
        [
          "CCB Goiás!",
          "RJM-Cidade de Goiás✅",
          "ADM CCB - Cidade de Goiás",
          "Orquestra Cidade de Goiás",
          "Irmandade Uvá",
          "API",
        ].includes(chatName)
      ) {
        api.sendMessage(
          `${contact.name || contact.pushname} (${
            notification.author.replace("@c.us", "") || ""
          }) ${notification.type} => ${notification.id.participant.replace(
            "@c.us",
            ""
          )} no grupo ${chatName}!`
        );
        // state.whatsapp.app.sendMessage(
        //   notification.id.participant,
        //   `Seja muito bem vindo ao grupo ${chatName} 😃`
        // );
      }
    }
  );

  state.whatsapp.ready.subscribe(async () => {
    console.log("ENVIAR MENSAGEM CAAE...");
    for (const msg of msgs) {
      try {
        const fone = phone.format(msg.to);
        if (fone) {
          await app.sendMessage(fone, msg.body);
        }
      } catch (e) {
        console.log(`to: ${msg.to};\tErro: ${e}`);
      }
    }
  });

  return {};
}

module.exports = init;
