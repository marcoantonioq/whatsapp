import { InterfaceRepository, Message } from "../core/Message";

export class SendMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(msg: Partial<Message>) {
    const message = Message.create(msg);
    if (message.to) {
      if (message.body?.startsWith("🤖: ")) {
        message.isBot = true;
      }
      if (message.isBot) {
        message.body = `🤖: ${message.body}`;
      }

      try {
        await this.repo.send(message);
      } catch (e) {
        console.log("Erro ao enviar mensagem:::", e, this.repo);
      }
    }
    return true;
  }
}
export default SendMessage;
