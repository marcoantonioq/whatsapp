import { google as GoogleApis } from "googleapis";
import EventEmitter from "events";

export enum Events {
  AUTHENTICATED = "authenticated",
}

class Google extends EventEmitter {
  private static instance: Google;
  private authenticated = false;
  client: any;
  private constructor() {
    super();
  }
  static create(): Google {
    if (!Google.instance) {
      Google.instance = new Google();
    }
    return Google.instance;
  }

  async auth(auth: any) {
    if (!this.authenticated) {
      const authentication = new GoogleApis.auth.GoogleAuth(auth);
      this.client = await authentication.getClient();
      this.emit(Events.AUTHENTICATED, this.client);
      this.authenticated = true;
    }
    return this.client;
  }

  get spreadsheets() {
    return GoogleApis.sheets({
      version: "v4",
      auth: this.client,
    }).spreadsheets;
  }

  get people() {
    return GoogleApis.people({
      version: "v1",
      auth: this.client,
    }).people;
  }

  get speech() {
    return GoogleApis.speech({
      version: "v1",
      auth: this.client,
    }).speech;
  }

  get search() {
    return GoogleApis.customsearch({
      version: "v1",
      auth: this.client,
    }).cse;
  }

  get storage() {
    return GoogleApis.storage({ version: "v1", auth: this.client });
  }
}

const google = Google.create();

console.log("BUCKETS::::", google.storage.buckets);

export default Google;
