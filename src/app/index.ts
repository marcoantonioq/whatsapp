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
    module.initialize(this);
    this.modules.push(module);
  }
}

const app = App.create();

import { module as Shell } from "@modules/shell";
import { module as Contatos } from "@modules/contacts";
import { module as Messages } from "@modules/messages";
import { module as Google } from "@modules/google";
import { module as OpenAI } from "@modules/openai";
app.add(Shell);
app.add(Contatos);
app.add(Messages);
app.add(Google);
app.add(OpenAI);
