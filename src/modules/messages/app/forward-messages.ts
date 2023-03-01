import { format } from "@libs/phone";
import { InterfaceRepository } from "../core/Message";

export interface payload {
  number: string;
  messagesID: string[];
}

export class ForwardMessages {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute({ number, messagesID }: payload) {
    const result = {
      msg: "",
      status: true,
      error: "",
    };
    console.log("Mensagem para envio: ", number, messagesID);
    if (number && messagesID.length) {
      try {
        const num = number.match(/@(g|c)\.us$/gi)
          ? number
          : `55${format(number)}@c.us`;
        await this.repo.forwardMessages(num, messagesID);
      } catch (e) {
        result.error = String(e);
      }
    } else {
      result.msg = "Informe números e mensagens para envio!";
      result.error = "Números inválidos!";
    }
    return result;
  }
}
export default ForwardMessages;
