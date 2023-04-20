import { InterfaceRepository, Message } from "../core/Message";

export class ReplayMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(
    to: string,
    message: string,
    messageID: string,
    mentionedList?: string[]
  ): Promise<Message> {
    return await this.repo.replay(to, message, messageID, mentionedList);
  }
}
export default ReplayMessage;
