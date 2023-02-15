import { app } from "../Whatsapp";

app.on("loading_screen", (percent: String, message: String) => {
  console.log("WHATSAPP: LOADING SCREEN", percent, message);
});
