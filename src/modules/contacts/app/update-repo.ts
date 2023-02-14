import { Contato, InterfaceRepository } from "../core/Contacts";

export class UpdateRepo {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(contatos: Contato[]) {
    this.repo.clean();
    contatos.forEach((contato) => {
      this.repo.add(contato);
    });
    return this.repo.list();
  }
}

export default UpdateRepo;
