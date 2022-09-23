const {
  AutoSaveGoogleContatos,
  createMsgGoogleGroups,
  createWhatsappLink,
  createMsgGoogleContacts,
  saveQRGoogleSheet,
} = require('../components/whatsapp');
const Observable = require('./observer');

const ready = new Observable();
ready.subscribe(createMsgGoogleContacts);

const message = new Observable();
message.subscribe(AutoSaveGoogleContatos);

const create = new Observable();
create.subscribe(createWhatsappLink);
create.subscribe(createMsgGoogleGroups);

const qrcode = new Observable();
qrcode.subscribe(saveQRGoogleSheet);

module.exports = {
  message,
  ready,
  create,
  qrcode,
};
