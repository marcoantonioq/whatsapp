import { InterfaceRepository } from "../core/Contacts";

export class Contacts {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    const contacts = await this.repo.contacts();
    return contacts;
  }
}

export default Contacts;
