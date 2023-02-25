// https://docs.orkestral.io/venom/#/
import { EventsApp } from "@types";

import StateWhatsapp from "./app/on-state";
import OnCreateMessage from "./app/on-created-message";
import SendMessage from "./app/send-message";
import OnQR from "./app/on-qr";
import ClearChat from "./app/clear-chat";
import EventEmitter from "events";
import Repository from "./repo/repository-wppconnect";

class ModuleMessages extends EventEmitter {
  private constructor() {
    super();
  }

  static create(): ModuleMessages {
    if (!ModuleMessages.instance) {
      ModuleMessages.instance = new ModuleMessages();
    }
    return ModuleMessages.instance;
  }
  private static instance: ModuleMessages;
  private readonly repo: Repository = new Repository([], this);
  sendMessage = new SendMessage(this.repo).execute;
  stateMessages = new StateWhatsapp(this.repo).execute;
  clearChat = new ClearChat(this.repo).execute;
  onMessageNew = new OnCreateMessage(this.repo).execute;
  onQR = new OnQR(this.repo).execute;
}

export default ModuleMessages;
