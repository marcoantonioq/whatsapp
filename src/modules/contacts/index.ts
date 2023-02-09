import SyncSheet from "./app/sync-sheet";
import { RepositoryMemory } from "./infra/repo-memory";
import { EventsApp, Module as ModuleType } from "@types";

export class Module implements ModuleType {
  async initialize(app: import("events")): Promise<Boolean> {
    const contatos = new RepositoryMemory([]);

    const syncSheet = new SyncSheet(contatos);
    syncSheet.execute().then((result) => {
      app.emit(EventsApp.UPDATE_CONTACT, result);
    });
    return true;
  }
}
