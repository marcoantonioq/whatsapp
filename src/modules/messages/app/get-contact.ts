import { Contact, InterfaceRepository } from "../core/Message";

export class GetContact {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(contactID: string): Promise<Contact> {
    return this.repo.getContact(contactID);
  }
}
export default GetContact;
