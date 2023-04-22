import ClearChat from "./app/clear-chat";
import DownloadMedia from "./app/download-media";
import ForwardMessages from "./app/forward-messages";
import GetContactWhatsapp from "./app/get-contact-whatsapp";
import OnCreateMessage from "./app/on-created-message";
import OnQR from "./app/on-qr";
import OnReady from "./app/on-ready";
import StateWhatsapp from "./app/on-state";
import { SendMessage } from "./app/send-message";
import { RepositoryWPPConnect } from "./repo/repository-wppconnect";

export class Whatsapp {
  private constructor() {}

  static create(): Whatsapp {
    return new Whatsapp();
  }
  private readonly repo = new RepositoryWPPConnect([]);
  clearChat = new ClearChat(this.repo).execute;
  forwardMessages = new ForwardMessages(this.repo).execute;
  getContact = new GetContactWhatsapp(this.repo).execute;
  onMessage = new OnCreateMessage(this.repo).execute;
  onQR = new OnQR(this.repo).execute;
  onReady = new OnReady(this.repo).execute;
  stateMessages = new StateWhatsapp(this.repo).execute;
  downloadMedia = new DownloadMedia(this.repo).execute;
  sendMessage = new SendMessage(this.repo).execute;
}
