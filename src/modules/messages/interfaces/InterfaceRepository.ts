import { EventEmitter } from "stream";
import { Message } from "../core/Message";

export interface SendMessageRequest {
  phone: string;
  message: string;
  isGroup: boolean;
}
export interface InterfaceRepository {
  event: EventEmitter;
  messages(): Promise<Message[]>;
  sendMessage(request: SendMessageRequest): Promise<Message>;
  delete(chatID: string, messageID: string): Promise<boolean>;
  forwardMessages(
    to: string,
    ids: string[],
    skipMyMessages?: boolean
  ): Promise<boolean>;
  clear(chatID: string): Promise<boolean>;
  download(messageID: string): Promise<string>;
  initialize(): Promise<boolean>;
}
