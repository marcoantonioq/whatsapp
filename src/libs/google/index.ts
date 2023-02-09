import { google as GoogleApis, sheets_v4 } from "googleapis";
import EventEmitter from "events";
import { GoogleAuthOptions } from "google-gax";
import { Events } from "./types";

export class Google extends EventEmitter {
  client: any;
  private constructor() {
    super();
  }
  static create(auth: GoogleAuthOptions) {
    const instance = new Google();
    instance.auth(auth);
    return instance;
  }

  async auth(auth?: GoogleAuthOptions) {
    const authentication = new GoogleApis.auth.GoogleAuth(auth);
    this.client = await authentication.getClient();
    this.emit(Events.AUTHENTICATED, this.client);
  }

  async sheets() {
    return GoogleApis.sheets({
      version: "v4",
      auth: await this.client,
    });
  }

  async people() {
    const people = await GoogleApis.people({
      version: "v1",
      auth: this.client,
    });
    return people;
  }
}

export default Google;
