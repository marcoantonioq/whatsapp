import { Whatsapp } from "@modules/messages";
import { Message } from "@modules/messages/core/Message";

export const messages = Whatsapp.create();

type request = {
  question: string;
  from: string;
  to: string;
};

function question(request: request): Promise<Message> {
  return new Promise(async (resolve) => {
    messages.onMessage((msg) => {
      if (msg.to === request.from && !msg.isGroup) {
        resolve(msg);
      }
    });
    console.log("Questão enviada>>>", request);
    // this.messages.sendMessage({
    //   message: text,
    //   phone: chatID,
    //   isGroup: false,
    // });
  });
}

// let api_lock = false;
// messages.onMessage(async (msg) => {
//   if (api_lock || msg.isBot || msg.to !== msg.from) return;
//   try {
//     if (msg.to.startsWith("556284972385")) {
//       console.log("Nova mensagem recebida >>>", msg);
//       api_lock = true;
//       // if (msg.body) {
//       //   const result = await MenuAPI.selectOption(msg.body);
//       // if (result) {
//       //   sendTextAPI(result);
//       // } else {
//       //   sendTextAPI(`Menu: \n${await MenuAPI.menu()}`);
//       // }
//       // }
//     }
//   } catch (e) {
//   } finally {
//     api_lock = false;
//   }
// });

async function start() {
  messages.onMessage((msg) => {
    msg.to === "";
    console.log("Nova mensagem: ", msg);
  });
}

start();
