import config from "@config/index";
import EventEmitter from "events";
import { Message } from "../core/Message";
import { io } from "socket.io-client";
import {
  InterfaceRepository,
  SendMessageRequest,
} from "../interfaces/InterfaceRepository";
import axios from "axios";

const server = `${config.session.server}/api/${config.session.name}`;
const headers = {
  headers: { Authorization: `Bearer ${config.session.token}` },
};

export class RepositoryWPPConnect implements InterfaceRepository {
  private socket = io(config.session.server);
  constructor(private readonly data: Message[]) {
    const session = config.session.name;
    this.socket.on("connect", () => {
      console.log(`Whatsapp connected: ${session}`);
    });

    this.socket.on("disconnect", () => {
      console.log(`Whatsapp disconnected: ${session}`);
    });

    this.socket.on(`mensagem-${session}`, (msg) => {
      this.event.emit("message", msg);
    });
  }
  public readonly event = new EventEmitter();
  messages(): Promise<Message[]> {
    throw new Error("Method not implemented.");
  }
  async sendMessage(request: SendMessageRequest) {
    const results = await axios.post(
      `${server}/send-message`,
      request,
      headers
    );
    return Message.createRecord(results.data.response[0]);
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
