// import RebootSystem from "./app/reboot-system";
import RepoShell from "./infra/repository";

import { EventsWhatsapp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const repo = new RepoShell([]);

    // app.on(EventsWhatsapp.DISCONNECTED, (state) => {
    //   new RebootSystem(repo).execute();
    // });

    app.on(EventsWhatsapp.BATTERY_CHANGED, async (level) => {
      console.log("Battery::: ", level);
    });
    return true;
  },
};
