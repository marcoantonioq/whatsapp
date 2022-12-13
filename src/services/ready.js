const { app } = require('../modules/whatsapp');

app.on('ready', async () => {
  // app.emit('saveMessage', { msg: 'teste' });
  const chats = await (await app.getChats()).filter((el) => el.isGroup);
  for (const chat of chats) {
    const participants = await chat.participants;
    for (const participant of participants) {
      const { id, number, name, pushname } = await app.getContactById(
        participant.id._serialized
      );
      const log = `${number},${name},${pushname},${id._serialized}\n`;
      console.log(log);
      fs.appendFile(`out/${chat.name}.csv`, log, (err) => {
        if (err) {
          console.log('Error write file: ', err);
          return err;
        }
      });
    }
  }

  //   client.isRegisteredUser("911234567890@c.us").then(function(isRegistered) {
  //     if(isRegistered) {
  //         client.sendMessage("911234567890@c.us", "hello");
  //     }
  // })
});
