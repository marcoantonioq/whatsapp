import { Client, LocalAuth } from "whatsapp-web.js";
import { Module, WhatsappSettings } from "@types";
import EventEmitter from "events";

export class App extends EventEmitter {
  readonly whatsapp: Client;
  readonly modules: Array<Module> = [];
  private constructor(settings: WhatsappSettings) {
    super();
    const { clientId, puppeteer } = settings;
    this.whatsapp = new Client({
      authStrategy: new LocalAuth({
        clientId,
      }),
      puppeteer,
    });
  }
  static create(settings: WhatsappSettings) {
    const app = new App(settings);
    return app;
  }

  add(module: Module) {
    module.initialize(this.whatsapp);
    this.modules.push(module);
  }
}

export interface InterfaceRepository {
  index(): [];
}
