import { Client, LocalAuth } from "whatsapp-web.js";
import { WhatsappSettings } from "@types";

export class Whatsapp {
  private static _app: Client;
  private constructor() {}
  static create(settings: WhatsappSettings): Client {
    if (!this._app) {
      const { clientId, puppeteer } = settings;
      this._app = new Client({
        authStrategy: new LocalAuth({
          clientId,
        }),
        puppeteer,
      });
    }
    return this._app;
  }
}

export interface InterfaceRepository {
  index(): [];
}
