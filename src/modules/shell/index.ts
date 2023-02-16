import QrConsole from "./app/qr-console";
import RepoShell from "./infra/repository";

import { EventsWhatsapp, Module as ModuleType } from "@types";

export const module = <ModuleType>{
  async initialize(app: import("events")): Promise<Boolean> {
    const repo = new RepoShell([]);

    app.on(EventsWhatsapp.QR_RECEIVED, async (qr) => {
      new QrConsole(repo).execute(qr);
    });

    app.on(EventsWhatsapp.BATTERY_CHANGED, async (level) => {
      console.log("Battery::: ", level);
    });
    return true;
  },
};
