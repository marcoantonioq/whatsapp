import { Message } from "../core/Message";

interface params {
  to: string;
  msgs: Message[];
}

export class ForwardMessages {
  constructor(private readonly repo?: any) {}

  async execute({ to, msgs }: params) {
    this.repo.forwardMessages(to, msgs);
  }
}
export default ForwardMessages;
