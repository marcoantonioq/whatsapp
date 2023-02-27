import { InterfaceRepository, Message } from "../core/Message";

export class OnCreateMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(listener: (msg: Message) => void) {
    this.repo.event.on("message_create", listener);
  }
}
export default OnCreateMessage;
