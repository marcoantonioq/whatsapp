import { app, api } from "./whatsapp";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

app.on("message_create", async (msg) => {
  if (api.isToAPI(msg)) {
    const reboot = /^reboot$|^restart$/gi;
    if (msg.body.match(reboot)) {
      api.sendToAPI("Reiniciando API....");
      const { err, stdout, stderr } = await exec("/sbin/reboot");
      if (err) console.log(`Erro shell exec: ${err.message}`);
      if (stderr) console.log(`Erro shell stderr: ${stderr}`);
      console.log(stdout.trim());
    }
  }
});
