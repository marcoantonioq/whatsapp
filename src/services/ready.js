const { app } = require("../modules/whatsapp");
const fs = require("fs");

app.on("ready", async () => {
  app.emit("messageToAPI", "READY...");
  const chats = await (await app.getChats()).filter((el) => el.isGroup);
  for (const chat of chats) {
    try {
      const nameGroup = (chat.name || "").replace("/", "-");
      fs.appendFileSync(
        `out/${nameGroup}.csv`,
        `${new Date().toISOString()}\n`
      );
      const participants = await chat.participants;
      for (const participant of participants) {
        const { id, number, name, pushname } = await app.getContactById(
          participant.id._serialized
        );
        const log = `${number},${name},${pushname},${id._serialized}\n`;
        fs.appendFileSync(`out/${nameGroup}.csv`, log);
      }
    } catch (e) {
      console.log(`Erro READY log participantes grupos ${chat.name}:`, e);
    }
  }

  //   client.isRegisteredUser("911234567890@c.us").then(function(isRegistered) {
  //     if(isRegistered) {
  //         client.sendMessage("911234567890@c.us", "hello");
  //     }
  // })
});
