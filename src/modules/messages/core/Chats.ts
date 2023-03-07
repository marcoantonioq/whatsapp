import EventEmitter from "events";
import { ModuleMessages } from "..";

export class Chats {
  private events = new EventEmitter();
  private constructor(private io: ModuleMessages) {
    io.onMessageNew((msg) => {
      if (!msg.isBot) {
        this.events.emit(`response_${msg.to}`, msg.body);
      }
    });
  }

  static create(io: ModuleMessages) {
    return new Chats(io);
  }

  createQuestion(chatID: string) {
    return async (text: string) => {
      return this.question(text, chatID);
    };
  }

  question(text: string, chatID: string): Promise<string> {
    return new Promise(async (resolve) => {
      this.events.on(`response_${chatID}`, (response: string) => {
        resolve(response);
      });
      this.io.sendMessage({ body: text, to: chatID });
    });
  }
}
