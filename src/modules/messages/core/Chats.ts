import EventEmitter from "events";
import { ModuleMessages } from "..";
import { Message } from "./Message";

export class Chats {
  private events = new EventEmitter();
  private constructor(private io: ModuleMessages) {
    io.onMessageNew((msg) => {
      if (!msg.isBot) {
        this.events.emit(`response_${msg.to}`, msg);
      }
    });
  }

  static create(io: ModuleMessages) {
    return new Chats(io);
  }

  question(text: string, chatID: string): Promise<Message> {
    return new Promise(async (resolve) => {
      this.events.on(`response_${chatID}`, (msg: Message) => {
        resolve(msg);
      });
      this.io.sendMessage({ body: text, to: chatID });
    });
  }
}
