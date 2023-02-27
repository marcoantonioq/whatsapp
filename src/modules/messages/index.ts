import StateWhatsapp from "./app/on-state";
import OnCreateMessage from "./app/on-created-message";
import SendMessage from "./app/send-message";
import OnQR from "./app/on-qr";
import ClearChat from "./app/clear-chat";
import EventEmitter from "events";
import { RepositoryWPPConnect } from "./repo/repository-wppconnect";

export class ModuleMessages {
  private constructor() {}

  static create(): ModuleMessages {
    return new ModuleMessages();
  }
  private readonly repo = new RepositoryWPPConnect([]);
  sendMessage = new SendMessage(this.repo).execute;
  forwardMessage = this.repo.forward;
  stateMessages = new StateWhatsapp(this.repo).execute;
  clearChat = new ClearChat(this.repo).execute;
  onMessageNew = new OnCreateMessage(this.repo).execute;
  onQR = new OnQR(this.repo).execute;
}
