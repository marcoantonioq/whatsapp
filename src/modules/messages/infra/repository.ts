import { Message, InterfaceRepository } from "../core/Message";
export class Repository implements InterfaceRepository {
  constructor(private readonly data: Message[]) {}
  async messages(): Promise<Message[]> {
    return this.data;
  }
  async add(msg: Message): Promise<Boolean> {
    this.data.push(msg);
    return true;
  }
  delete(msg: Message): Promise<Boolean> {
    throw new Error("Method not implemented.");
  }
}

export default Repository;
