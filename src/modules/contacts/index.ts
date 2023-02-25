import UpdateValues from "./app/update-values";
import { Repository } from "./repo/repository";
import { EventsApp, GOOGLE_SHEET_GET, Module as ModuleType } from "@types";
import configs from "@config/index";
import { Contact } from "./core/Contacts";
import ExtractValues from "./app/extract-values-to-contact";

export const module = <ModuleType>{
  async create(app: import("events")) {
    const repo = new Repository([]);
    const extractValues = new ExtractValues(repo);
    const updateValues = new UpdateValues(repo);

    app.addListener(
      EventsApp.CONTACTS,
      async (params = { update: false, listener: Function }) => {
        let contacts: Contact[] = [];
        if (params.update) {
          contacts = await new Promise((resolve, reject) => {
            app.emit(EventsApp.GOOGLE_SHEET_GET, <GOOGLE_SHEET_GET>{
              spreadsheetId: configs.GOOGLE.SHEET_DOC_ID,
              range: "Contatos",
              listener: async (data: any) => {
                const contacts = await extractValues.execute(data.values);
                await updateValues.execute(contacts);
                resolve(await repo.contacts());
              },
            });
          });
        } else {
          contacts = await repo.contacts();
        }
        if (params.listener) params.listener(contacts);
      }
    );

    return true;
  },
};

export default module;
