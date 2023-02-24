import { Contact, InterfaceRepository } from "../core/Contacts";

export class UpdateValues {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(contacts: Contact[]) {
    for (const contact of contacts) {
      await this.repo.save(contact);
    }
    return this.repo.contacts();
  }
}

export default UpdateValues;
