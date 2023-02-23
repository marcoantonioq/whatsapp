import { Contact, InterfaceRepository } from "../core/Contacts";

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Contact[]) {}
  async clean(): Promise<Boolean> {
    this.data.slice(0, this.data.length);
    return true;
  }
  async contacts(): Promise<Contact[]> {
    return this.data;
  }
  async add(contato: Contact): Promise<Boolean> {
    this.data.push(contato);
    return true;
  }
  async delete(contato: Contact): Promise<Boolean> {
    this.data.slice(0);
    return true;
  }
}
