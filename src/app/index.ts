import configs from "@config/index";
import { messages, sendTextAPI } from "./handlers";
import { Menu } from "./Menus";
import { SUAP } from "./SUAP";
import { API } from "./API";

/**
 * Object
 */
export const MenuAPI = new Menu(API);
export const MenuSUAP = new Menu(SUAP);

let api_lock = false;
messages.onMessageNew(async (msg) => {
  if (api_lock || msg.isBot || msg.to !== configs.WHATSAPP.GROUP_API) return;
  try {
    api_lock = true;
    if (msg.body) {
      const result = await MenuAPI.selectOption(msg.body);
      if (result) {
        sendTextAPI(result);
      } else {
        sendTextAPI(`Menu: \n${await MenuAPI.menu()}`);
      }
    }
  } catch (e) {
  } finally {
    api_lock = false;
  }
});

messages.onMessageNew(async (msg) => {
  if (msg.isBot) return;
  if (msg.body && msg.from) {
    const contacts = ["556284972385@c.us", "556281779439@c.us"];
    if (msg.to === "556284972385@c.us" && contacts.includes(msg.from)) {
      const result = await MenuSUAP.selectOption("/" + msg.body);
      if (result && result.trim() !== "")
        messages.sendMessage({ to: msg.from, body: result });
    }
  }
});

messages.initialize();
