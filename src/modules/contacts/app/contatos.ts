import { InterfaceRepository } from "../core/Contacts";

export class Contatos {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute() {
    return await this.repo.contacts();
  }
}

export default Contatos;
