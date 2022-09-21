// const whats = require('../../components/whatsapp');
const sheet = require('../../components/google/sheets');
const Groups = require('../../enums/groups');
const phone = require('../../lib/phonenumber');

const contatos = {};

sheet.getRows('Contatos').then((result) => {
  result.forEach((el) => {
    (el._TELEFONES || '')
      .split(',')
      .map((tel) => phone.format(tel.trim()))
      .forEach((tel) => {
        contatos[tel] = el._NOME;
      });
  });
});

sheet.getRows('Save').then((result) => {
  result.forEach((el) => {
    contatos[phone.format(el['Phone 1 - Value'])] = el.Name;
  });
});

// eslint-disable-next-line require-await
async function AutoSaveGoogleContatos(msg) {
  const contact = await msg.getContact();
  const chat = await msg.getChat();
  // console.log('Contact: ', contact);
  // console.log('Chat: ', chat);

  if (!contatos[contact.id._serialized]) {
    const groups = new Groups();
    const doc = await sheet.getDoc();
    const plan = doc.sheetsByTitle.Save;
    groups.values = 'AutoSave';
    if (chat.isGroup) {
      groups.values = chat.name;
    }
    contatos[contact.id._serialized] = contact.name || contact.pushname;
    plan.addRow({
      Name: contact.name || contact.pushname,
      Birthday: '',
      Notes: contact.pushname,
      'Group Membership': groups.values.join(', '),
      'Phone 1 - Value': contact.number.replace(/(\d\d)(\d{8}$)/g, '$19$2'),
      'Organization 1 - Name': '',
    });
  }
}

module.exports = {
  AutoSaveGoogleContatos,
};
