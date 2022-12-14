const { app } = require("./whatsapp");

app.on("loading_screen", (percent, message) => {
  console.log("WHATSAPP: LOADING SCREEN", percent, message);
});
