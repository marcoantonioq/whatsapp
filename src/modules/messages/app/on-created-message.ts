import { Message } from "../core/Message";
import { InterfaceRepository } from "../interfaces/InterfaceRepository";

export class OnCreateMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(listener: (msg: Message) => void) {
    this.repo.event.on("message", (wppMSG) => {
      // console.log("Message wpp::", wppMSG);
      listener(Message.createRecord(wppMSG));
    });
  }
}
export default OnCreateMessage;
