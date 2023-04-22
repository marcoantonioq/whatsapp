import { Contact } from "../core/Message";
import { InterfaceRepository } from "../interfaces/InterfaceRepository";

export class GetContactWhatsapp {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(contactID: string): Promise<Contact | undefined> {
    // const contact = this.repo.getContact(contactID);
    // return contact;
    return undefined;
  }
}
export default GetContactWhatsapp;
