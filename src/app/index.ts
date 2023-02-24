import { EventsApp, GOOGLE_SHEET_GET, Module } from "@types";
import EventEmitter from "events";

declare interface App {
  on(event: EventsApp.MESSAGE_CREATE, listener: (msg: Message) => void): this;
  on(event: EventsApp.MESSAGE_SEND, listener: (msg: Message) => void): this;
  on(
    event: EventsApp.FORWARD_MESSAGES,
    listener: (request: { to: string; ids: string[] }) => void
  ): this;
  on(event: EventsApp.MESSAGES, listener: (callback: Function) => void): this;
  on(event: EventsApp.QR_RECEIVED, listener: (qr: string) => void): this;
  on(
    event: EventsApp.STATUS,
    listener: (state: string, session: string) => void
  ): this;
  on(
    event: EventsApp.UPDATE,
    listener: (event: { id: string; data: any }) => void
  ): this;
  on(event: string, listener: Function): this;
  emit(
    event: EventsApp.GOOGLE_SHEET_GET,
    params: {
      spreadsheetId: string;
      range: string;
      listener: Function;
    }
  ): boolean;
  emit(
    event: EventsApp.CONTACTS,
    params: {
      listener: (contacts: Contact[]) => void;
      update?: Boolean;
    }
  ): boolean;
  emit(
    event: EventsApp.FORWARD_MESSAGES,
    params: {
      to: string;
      msgs: Message[];
    }
  ): boolean;
  emit(event: string, listener: any): boolean;
}

class App extends EventEmitter {
  readonly modules: Array<any> = [];
  private constructor() {
    super();
  }
  static create() {
    return new App();
  }
  add(module: Module) {
    try {
      module.initialize(this);
      this.modules.push(module);
    } catch (e) {
      console.log("Erro module:::", e);
    }
  }
}

export default App;

const app = App.create();

import { module as Shell } from "@modules/shell";
import { module as Contatos } from "@modules/contacts";
import { module as Messages } from "@modules/messages";
import { module as Google } from "@modules/google";
import { module as OpenAI } from "@modules/openai";
import { module as Sonic } from "@modules/writesonic";
import { module as SEND } from "@modules/send";
import { Contact } from "@modules/contacts/core/Contacts";
import { Message } from "@modules/messages/core/Message";
app.add(Messages);
app.add(Shell);
app.add(Google);
app.add(Contatos);
app.add(OpenAI);
app.add(Sonic);
app.add(SEND);

app.emit(EventsApp.CONTACTS, {
  listener: (contatos) => {
    // console.log(`Contatos recebidos::::::: `, contatos);
  },
  update: true,
});
