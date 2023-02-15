import QrConsole from "./app/qr-console";
import RebootSystem from "./app/reboot-system";
import RepoShell from "./infra/repository";

import { EventsWhatsapp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const repo = new RepoShell([]);

    // app.on(EventsWhatsapp.QR_RECEIVED, async (qr) => {
    //   new QrConsole(repo).execute(qr);
    // });
    app.on(EventsWhatsapp.DISCONNECTED, (reason) => {
      new RebootSystem(repo).execute();
    });
    return true;
  },
};
