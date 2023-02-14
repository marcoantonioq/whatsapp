import { api } from "../Api";
import { app } from "../Whatsapp";

app.on("disconnected", (reason) => {
  console.log("disconnected");
  api.reboot();
});

app.on("state_changed", (reason) => {
  console.log("Client was logged out.", reason);
});
