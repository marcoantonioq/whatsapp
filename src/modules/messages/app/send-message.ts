import configs from "@config/index";
import { InterfaceRepository, Message } from "../core/Message";

export class SendMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(msg: Message) {
    if (msg.to) {
      const { GROUP_API, GROUP_SEND, GROUP_NOTE, MY_NUMBER } = configs.WHATSAPP;
      const toBoot = [GROUP_API, GROUP_SEND, GROUP_NOTE, MY_NUMBER].includes(
        msg.to
      );
      if (toBoot) {
        msg.body = `🤖: ${msg.body}`;
      }

      this.repo.send(msg);
    }
    return true;
  }
}
export default SendMessage;
