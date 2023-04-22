import { Chats } from "@modules/messages/core/Chats";
import { messages } from ".";
import { menu } from "./Menus";
export const chats = Chats.create(messages);
export const API: menu[] = [
  {
    label: "Enviar mensagem",
    regex: "send|enviar|msg",
    action: async () => {
      console.log("enviar mensagem");
      messages
        .sendMessage({
          phone: "556284972385",
          message: "Hello World 2",
          isGroup: false,
        })
        .then((result) => {
          console.log("Resultado do envio::", result);
        });
      return "";
    },
  },
];
