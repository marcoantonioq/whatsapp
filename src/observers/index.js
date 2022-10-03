const {
  AutoSaveGoogleContatos,
  createMsgGoogleGroups,
  createWhatsappLink,
  createMsgGoogleContacts,
  saveQRGoogleSheet,
  logMsg,
} = require('../modules/whatsapp');
const Observable = require('./observer');

const ready = new Observable();
ready.subscribe(createMsgGoogleContacts);

const message = new Observable();
message.subscribe(logMsg).subscribe(AutoSaveGoogleContatos);

const create = new Observable();
create.subscribe(createWhatsappLink).subscribe(createMsgGoogleGroups);

const qrcode = new Observable();
qrcode.subscribe(saveQRGoogleSheet);

module.exports = {
  message,
  ready,
  create,
  qrcode,
};
