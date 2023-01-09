import { app } from "../Whatsapp";

app.on("disconnected", (reason) => {
  console.log("disconnected");
});

app.on("state_changed", (reason) => {
  console.log("Client was logged out.", reason);
});
