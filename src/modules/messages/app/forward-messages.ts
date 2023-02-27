import { InterfaceRepository, Message } from "../core/Message";

interface params {
  to: string;
  msgs: string[];
}

export class ForwardMessages {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute({ to, msgs }: params) {
    this.repo.forward(to, msgs);
  }
}
export default ForwardMessages;
