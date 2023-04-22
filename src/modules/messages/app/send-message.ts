import { Message } from "../core/Message";
import {
  InterfaceRepository,
  SendMessageRequest,
} from "../interfaces/InterfaceRepository";

export class SendMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(request: SendMessageRequest): Promise<Message> {
    if (request.phone && request.message?.startsWith("🤖: ")) {
      request.message = `🤖: ${request.message}`;
    }
    const message = this.repo.sendMessage(request);
    return message;
  }
}
