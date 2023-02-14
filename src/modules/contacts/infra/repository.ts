import { Contato, InterfaceRepository } from "../core/Contacts";

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Contato[]) {}
  async clean(): Promise<Boolean> {
    this.data.slice(0, this.data.length);
    return true;
  }
  async list(): Promise<Contato[]> {
    return this.data;
  }
  async add(contato: Contato): Promise<Boolean> {
    this.data.push(contato);
    return true;
  }
  async delete(contato: Contato): Promise<Boolean> {
    this.data.slice(0);
    return true;
  }
}
