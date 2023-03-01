import { Repository } from "./repo/repository";
import Update from "./app/update";
import Contatos from "./app/contatos";

export class ModuleContacts {
  private constructor() {}

  static create(): ModuleContacts {
    return new ModuleContacts();
  }
  private readonly repo: Repository = new Repository([]);
  update = new Update(this.repo).execute;
  contacts = new Contatos(this.repo).execute;
}
