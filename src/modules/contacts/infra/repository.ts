import { Contact, InterfaceRepository } from "../core/Contacts";

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Contact[]) {}
  async clean(): Promise<Boolean> {
    // this.data.slice(0, this.data.length);
    return true;
  }
  async contacts(): Promise<Contact[]> {
    return this.data;
  }
  async save(contact: Contact): Promise<Boolean> {
    const id = this.data.findIndex((item) => item.id === contact.id);
    if (id > -1) this.data.splice(id, 1);
    this.data.push(contact);
    return true;
  }
  async delete(contact: Contact): Promise<Boolean> {
    // this.data.slice(0);
    return true;
  }
}
