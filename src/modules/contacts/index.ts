import { Repository } from "./repo/repository";
import UpGoogleSheetToContact from "./app/update-google-sheet-to-contact";
import Contacts from "./app/get-contacts";
import OnCreateMessage from "./app/on-created-contact";

export class ModuleContacts {
  private constructor() {}

  static create(): ModuleContacts {
    return new ModuleContacts();
  }
  private readonly repo: Repository = new Repository([]);
  upGoogleSheetToContact = new UpGoogleSheetToContact(this.repo).execute;
  contacts = new Contacts(this.repo).execute;
  onCreate = new OnCreateMessage(this.repo).execute;
}
