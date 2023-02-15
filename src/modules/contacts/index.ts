import UpdateRepo from "./app/update-repo";
import { Repository } from "./infra/repository";
import { EventsApp, Module as ModuleType } from "@types";
import { Contato } from "./core/Contacts";

export const module = <ModuleType>{
  async initialize(app: import("events")) {
    const contatos = new Repository([]);
    app.on(EventsApp.CONTACTS_UPDATE, async (contacts) => {
      await new UpdateRepo(contatos).execute(contacts);
    });
    app.on(EventsApp.CONTACTS_GET, async (callback) => {
      callback(await contatos.list());
    });
    return true;
  },
};

export default module;
