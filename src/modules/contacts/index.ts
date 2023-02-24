import UpdateValues from "./app/update-values";
import { Repository } from "./infra/repository";
import { EventsApp, GOOGLE_SHEET_GET, Module as ModuleType } from "@types";
import configs from "@config/index";
import { Contact } from "./core/Contacts";
import ExtractValues from "./app/extract-values-to-contact";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    const repo = new Repository([]);
    const extractValues = new ExtractValues(repo);
    const updateValues = new UpdateValues(repo);

    app.addListener(
      EventsApp.CONTACTS,
      async (
        params: {
          update: Boolean;
          action: "index" | "get";
          number?: string;
          listener?: Function;
        } = {
          update: false,
          action: "index",
        }
      ) => {
        switch (params.action) {
          case "index":
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

            break;
          case "get":
            if (params.listener && params.number) {
              const contact = repo.getContactByPhone(params.number);
              params.listener(contact);
            }
            break;

          default:
            break;
        }
      }
    );

    return true;
  },
};

export default module;
