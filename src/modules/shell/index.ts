// import RebootSystem from "./app/reboot-system";
import RepoShell from "./infra/repository";

import { Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const repo = new RepoShell([]);

    // app.on(EventsApp.DISCONNECTED, (state) => {
    //   new RebootSystem(repo).execute();
    // });

    return true;
  },
};
