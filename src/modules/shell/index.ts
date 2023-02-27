// import RebootSystem from "./app/reboot-system";
import RepoShell from "./repo/repository";

import { EventsApp, Module as ModuleType } from "@types";
import App from "src/app";

export const module = <ModuleType>{
  async create(app: App): Promise<Boolean> {
    const repo = new RepoShell([]);

    app.on(EventsApp.MESSAGE_CREATE, (msg) => {
      if (msg.body?.match(/^cls$/gi) && msg.to) {
        app.emit(EventsApp.CLEAR, msg.to);
      }
    });

    // app.on(EventsApp.DISCONNECTED, (state) => {
    //   new RebootSystem(repo).execute();
    // });

    return true;
  },
};
