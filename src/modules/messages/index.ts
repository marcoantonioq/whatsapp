import StateWhatsapp from "./app/on-state";
import OnCreateMessage from "./app/on-created-message";
import SendMessage from "./app/send-message";
import OnQR from "./app/on-qr";
import ClearChat from "./app/clear-chat";
import { RepositoryWPPConnect } from "./repo/repository-wppconnect";
import ForwardMessages from "./app/forward-messages";
import GetContactWhatsapp from "./app/get-contact-whatsapp";
import OnReady from "./app/on-ready";
import Initialize from "./app/initialize-services";

export class ModuleMessages {
  private constructor() {}

  static create(): ModuleMessages {
    return new ModuleMessages();
  }
  private readonly repo = new RepositoryWPPConnect([]);
  clearChat = new ClearChat(this.repo).execute;
  forwardMessages = new ForwardMessages(this.repo).execute;
  getContact = new GetContactWhatsapp(this.repo).execute;
  initialize = new Initialize(this.repo).execute;
  onMessageNew = new OnCreateMessage(this.repo).execute;
  onQR = new OnQR(this.repo).execute;
  onReady = new OnReady(this.repo).execute;
  sendMessage = new SendMessage(this.repo).execute;
  stateMessages = new StateWhatsapp(this.repo).execute;
}
