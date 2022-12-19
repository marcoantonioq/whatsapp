const { app } = require("./whatsapp");
const fs = require("fs");

app.on("ready", async () => {
  app.emit("messageToAPI", "READY...");
  //   client.isRegisteredUser("911234567890@c.us").then(function(isRegistered) {
  //     if(isRegistered) {
  //         client.sendMessage("911234567890@c.us", "hello");
  //     }
  // })
});
