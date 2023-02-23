import UpdateValues from "./app/update-values";
import { Repository } from "./infra/repository";
import { EventsApp, Module as ModuleType } from "@types";
import configs from "@config/index";
import { Contact } from "./core/Contacts";

const arrayValuesToContact = (values: any[]) => {
  return values
    .filter(([nome, , telefone]: [string, string, string]) => nome && telefone)
    .map(
      ([nome, notas, telefones, aniversario, grupos, address, id]: [
        string,
        string,
        string,
        string,
        string,
        string,
        string
      ]) =>
        Contact.create({
          address,
          aniversario,
          grupos,
          id,
          nome,
          notas,
          telefones,
        })
    );
};

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    const repo = new Repository([]);

    app.emit(EventsApp.GOOGLE_SHEET_GET, {
      spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
      range: "Contatos",
      call: async (data: any) => {
        const contacts = arrayValuesToContact(data.values);
        await new UpdateValues(repo).execute(contacts);
        app.emit(EventsApp.UPDATE, { id: "contacts", data: repo.contacts() });
      },
    });

    app.on(EventsApp.CONTACTS, async (callback: Function) => {
      const contacts = await repo.contacts();
      if (callback) callback(contacts);
      return contacts;
    });

    return true;
  },
};

export default module;
