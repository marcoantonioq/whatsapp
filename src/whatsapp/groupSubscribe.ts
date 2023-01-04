const { app, api } = require("./whatsapp");

/**
 * groupLeave: O usuário saiu ou foi expulso do grupo
 * @param {notification} notification Notification whatsapp
 */
async function subscribe(notification: any) {
  const { name: chatName } = await notification.getChat();
  const contact = await notification.getContact();
  const type = notification.type === "remove" ? "➖ 📵" : "➕ 📲";
  const participant = notification.id.participant.replace("@c.us", "");
  api.sendToAPI(
    `${type} ${participant} grupo ${chatName} por 🙋‍♂️ ${
      contact.name || contact.pushname
    }!`
  );
}

app.on("group_join", subscribe);
app.on("group_leave", subscribe);
