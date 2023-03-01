import { InterfaceRepository, Contact } from "../core/Contacts";

export class OnCreateMessage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(listener: (contact: Contact) => void) {
    this.repo.event.on("contact_create", listener);
  }
}
export default OnCreateMessage;
