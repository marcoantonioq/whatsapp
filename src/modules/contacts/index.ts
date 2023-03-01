import { Repository } from "./repo/repository";
import GetGoogleSheet from "./app/get-google-sheet";
import Contatos from "./app/contatos";
import OnCreateMessage from "./app/on-created-contact";

export class ModuleContacts {
  private constructor() {}

  static create(): ModuleContacts {
    return new ModuleContacts();
  }
  private readonly repo: Repository = new Repository([]);
  getGoogleSheetToRepo = new GetGoogleSheet(this.repo).execute;
  contacts = new Contatos(this.repo).execute;
  onCreate = new OnCreateMessage(this.repo).execute;
}
