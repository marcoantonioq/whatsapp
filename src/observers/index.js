/* eslint-disable no-unused-vars */
const {
  AutoSaveGoogleContatos,
  createMsgGoogleGroups,
  createWhatsappLink,
  sendDB,
  saveQRGoogleSheet,
  // logMsg,
  sendRead,
  qrCodeGenrateConsole,
} = require('../modules/whatsapp');
const Observable = require('./observerWhatsapp');

const ready = new Observable()
  .subscribe(() => {
    console.log("READY....")
  })
  .subscribe(sendDB)

const message = new Observable();
// message
// .subscribe(logMsg);
// .subscribe(AutoSaveGoogleContatos);

const create = new Observable()
  .subscribe(createWhatsappLink)
  .subscribe(createMsgGoogleGroups);

const qrcode = new Observable()
  .subscribe(saveQRGoogleSheet)
  .subscribe(qrCodeGenrateConsole)

module.exports = {
  message,
  ready,
  create,
  qrcode,
};
