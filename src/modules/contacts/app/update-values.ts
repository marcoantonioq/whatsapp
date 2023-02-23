import { Contact, InterfaceRepository } from "../core/Contacts";

export class UpdateValues {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(contacts: Contact[]) {
    this.repo.clean();
    contacts.forEach(this.repo.add);
    console.log("Contatos recebidos:::", await this.repo.contacts());

    return this.repo.contacts();
  }
}

export default UpdateValues;
