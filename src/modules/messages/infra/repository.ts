import { Message, InterfaceRepository } from "../core/Message";
export class Repository implements InterfaceRepository {
  constructor(private readonly data: Message[]) {}
  async add(msg: Message): Promise<Boolean> {
    return true;
  }
  async list(): Promise<Message[]> {
    return [];
  }
}

export default Repository;
