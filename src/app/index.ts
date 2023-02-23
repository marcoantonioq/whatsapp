import { Module } from "@types";
import EventEmitter from "events";

export class App extends EventEmitter {
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

const app = App.create();

import { module as Shell } from "@modules/shell";
import { module as Contatos } from "@modules/contacts";
import { module as Messages } from "@modules/messages";
import { module as Google } from "@modules/google";
import { module as OpenAI } from "@modules/openai";
import { module as Sonic } from "@modules/writesonic";
import { module as SEND } from "@modules/send";
// app.add(Messages);
// app.add(Shell);
app.add(Google);
app.add(Contatos);
// app.add(OpenAI);
// app.add(Sonic);
// app.add(SEND);
