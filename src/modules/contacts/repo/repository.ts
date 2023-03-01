import { EventEmitter } from "stream";
import { Contact, InterfaceRepository } from "../core/Contacts";

export class Repository implements InterfaceRepository {
  constructor(private readonly data: Contact[]) {}
  public readonly event = new EventEmitter();
  async clean(): Promise<Boolean> {
    // this.data.slice(0, this.data.length);
    return true;
  }
  async contacts(): Promise<Contact[]> {
    return this.data;
  }

  async getContactByPhone(number: string) {
    const id = this.data.findIndex((item) => item.telefones.includes(number));
    if (id > -1) {
      return this.data[id];
    } else {
      const contact = Contact.create({ telefones: number });
      this.data.push(contact);
      return contact;
    }
  }

  async save(contact: Contact): Promise<Boolean> {
    const id = this.data.findIndex((item) => item.id === contact.id);
    if (id > -1) this.data.splice(id, 1);
    this.data.push(contact);
    this.event.emit("contact_create", contact);
    return true;
  }
  async delete(contact: Contact): Promise<Boolean> {
    // this.data.slice(0);
    return true;
  }
}
