import QrCodeConsole from "./app/qr-code";
import RebootSystem from "./app/reboot-system";
import RepoShell from "./infra/repo-mem";

import { Module as ModuleType } from "@types";

export class Module implements ModuleType {
  async initialize(app: import("events")): Promise<Boolean> {
    const repo = new RepoShell([]);

    const rebootSystem = new RebootSystem(repo);
    const qrCodeConsole = new QrCodeConsole(repo);
    app.on("qr", async (qr) => {
      qrCodeConsole.execute(qr);
    });
    app.on("disconnected", (reason) => {
      // rebootSystem.execute();
    });
    return true;
  }
}
