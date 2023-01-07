import { DataBase } from "./DataBase";
import { Messages } from "@prisma/client";
import {
  MessageContent,
  MessageMedia,
  MessageSendOptions,
} from "whatsapp-web.js";
import { formatWhatsapp } from "../libs/Phone";
import { app } from "../Whatsapp";

export class Message extends DataBase {
  private _content: MessageContent = this.defaultContent();
  messageOptions: MessageSendOptions = this.defaultOptions();

  constructor(data?: Messages) {
    super(data);
  }
  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }

  defaultContent() {
    return "";
  }

  defaultOptions() {
    return {};
  }

  formatNumber() {
    if (this.data) this.data.to = formatWhatsapp(this.data.to);
  }

  createMessage() {
    this.formatNumber();
    if (this.data.hasMedia && this.data.mimetype && this.data.data) {
      this.content = new MessageMedia(
        this.data.mimetype,
        this.data.data,
        this.data.body
      );
      switch (this.data.type) {
        case "ptt":
          this.messageOptions.sendAudioAsVoice = true;
          break;
        case "image":
          this.messageOptions.caption = this.data.body || undefined;
        default:
          break;
      }
    } else {
      if (this.data.body) this.content = this.data.body;
    }
    return this;
  }

  reset() {
    super.reset();
    this.content = this.defaultContent();
    this.messageOptions = this.defaultOptions();
  }

  async replaceNomeContact() {
    const reg = /_NOME/gi;
    const contact: any = await app.getContactById(this.data.to);
    this.data.body = ["name", "pushname", "shortName"]
      .filter((title) => contact[title])
      .filter((title) => contact[title].trim() !== "")
      .reduce((acc, title) => {
        return acc ? acc.replace(reg, `${contact[title]}`) : acc;
      }, this.data.body);
    this.data.body = this.data.body?.replace(reg, "") || null;
  }

  async send() {
    this.createMessage();
    if (this.data && this.data.to && this.content) {
      await app.sendMessage(this.data.to, this.content, this.messageOptions);
    }
    return this;
  }

  async isRegisteredUser() {
    this.formatNumber();
    return await app.isRegisteredUser(this.data.to);
  }

  async destroy() {
    await super.destroy();
    this.reset();
  }
}
