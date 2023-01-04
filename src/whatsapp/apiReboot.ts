import { app, api } from "./whatsapp";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

app.on("message_create", async (msg) => {
  const reboot = /^reboot$|^restart$/gi;
  if (msg.body.match(reboot)) {
    if (api.isToAPI(msg)) {
      console.log("Reboot iniciado!!!!");
      const { err, stdout, stderr } = await exec("/sbin/reboot");
      if (err) console.log(`Erro shell exec: ${err.message}`);
      if (stderr) console.log(`Erro shell stderr: ${stderr}`);
      console.log(stdout.trim());
    }
  }
});
