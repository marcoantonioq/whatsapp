import { Contato, InterfaceRepository } from "../core/Contacts";

export class RepositoryMemory implements InterfaceRepository {
  constructor(private readonly data: Array<Contato>) {}
  async clean(): Promise<Boolean> {
    this.data.slice(0, this.data.length);
    return true;
  }
  async index(): Promise<Contato[]> {
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
