import EventEmitter from "events";
import { Whatsapp } from "..";
import { Message } from "./Message";

export class Chats {
  private events = new EventEmitter();
  private constructor(private messages: Whatsapp) {
    messages.onMessage((msg) => {
      this.events.emit(`response_${msg.to}`, msg);
    });
  }

  static create(messages: Whatsapp) {
    return new Chats(messages);
  }

  question(text: string, chatID: string): Promise<Message> {
    return new Promise(async (resolve) => {
      this.events.on(`response_${chatID}`, (msg: Message) => {
        console.log("Mensagem respondida::: ", msg);
        resolve(msg);
      });
      // this.messages.sendMessage({
      //   message: text,
      //   phone: chatID,
      //   isGroup: false,
      // });
    });
  }
}
