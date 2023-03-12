import configs from "@config/index";
import { messages, sendTextAPI } from "./handlers";
import { menuAPI } from "./Menus";

const G_SEND = configs.WHATSAPP.GROUP_SEND;

/**
 * Grupo API
 */
let api_lock = false;
messages.onMessageNew(async (msg) => {
  if (api_lock || msg.isBot || msg.to !== configs.WHATSAPP.GROUP_API) return;
  try {
    api_lock = true;
    if (msg.body) {
      const result = await menuAPI.selectOption(msg.body);
      if (result) {
        sendTextAPI(result);
      } else {
        sendTextAPI(`Menu: \n${await menuAPI.menu()}`);
      }
    }
  } catch (e) {
  } finally {
    api_lock = false;
  }
});

messages.initialize();
