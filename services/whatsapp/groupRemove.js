const contatos = require("../contatos");
const { app } = require("./whatsapp");
const phone = require("../phone");

app.on("ready", async () => {
  const chat = (await app.getChats()).filter(
    (el) => el.name === "Confraternização CCB 22"
  );
  console.log("Chat remove: ", chat);
});
