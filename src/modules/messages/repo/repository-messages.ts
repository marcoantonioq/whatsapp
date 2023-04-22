import EventEmitter from "events";
import { Message } from "../core/Message";
import { InterfaceRepository } from "../interfaces/InterfaceRepository";

export class RepositoryMessages implements InterfaceRepository {
  constructor(private readonly data: Message[]) {}
  public readonly event = new EventEmitter();
  messages(): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }
  sendMessage(msg: Message): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  delete(chatID: string, messageID: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  forwardMessages(
    to: string,
    ids: string[],
    skipMyMessages?: boolean | undefined
  ): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  clear(chatID: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  download(messageID: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  initialize(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
