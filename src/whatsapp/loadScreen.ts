import { app } from "./whatsapp";

app.on("loading_screen", (percent: String, message: String) => {
  console.log("WHATSAPP: LOADING SCREEN", percent, message);
});
