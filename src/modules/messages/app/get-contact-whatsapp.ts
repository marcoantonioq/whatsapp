import { Contact, InterfaceRepository } from "../core/Message";

export class GetContactWhatsapp {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(contactID: string): Promise<Contact | undefined> {
    const contact = this.repo.getContact(contactID);
    return contact;
  }
}
export default GetContactWhatsapp;
