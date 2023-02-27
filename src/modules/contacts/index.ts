import { Repository } from "./repo/repository";
import Update from "./app/update";

export class ModuleContacts {
  private constructor() {}

  static create(): ModuleContacts {
    if (!ModuleContacts.instance) {
      ModuleContacts.instance = new ModuleContacts();
    }
    return ModuleContacts.instance;
  }
  // private event = new EventEmitter();
  private static instance: ModuleContacts;
  private readonly repo: Repository = new Repository([]);
  update = new Update(this.repo).execute;
  contacts = this.repo.contacts;
}
export default ModuleContacts;
