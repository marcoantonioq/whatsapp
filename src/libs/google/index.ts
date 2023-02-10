import { google as GoogleApis } from "googleapis";
import EventEmitter from "events";
import { GoogleAuthOptions } from "google-gax";
import { Events } from "./types";

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
      console.log("Google authenticated!!!");
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
}

export default Google;
