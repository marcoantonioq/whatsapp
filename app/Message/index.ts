import { DataMessage } from "./DataMessage";
import { Messages } from "@prisma/client";
import {
  Message as msg,
  MessageContent,
  MessageMedia,
  MessageSendOptions,
} from "whatsapp-web.js";
import { app } from "../Whatsapp";

export class Message extends DataMessage {
  private _content: MessageContent = this.defaultContent();
  messageOptions: MessageSendOptions = this.defaultOptions();

  constructor(data?: Messages) {
    super(data);
    this.initialize();
  }

  get data() {
    return super.data;
  }

  set data(data) {
    super.data = data;
  }

  get content() {
    return this._content;
  }

  defaultContent() {
    return "";
  }

  defaultOptions() {
    return {};
  }

  reset() {
    super.reset();
    this._content = this.defaultContent();
    this.messageOptions = this.defaultOptions();
  }

  async replaceNomeContact() {
    const reg = /_NOME/gi;
    if (this.data.body?.match(reg)) {
      const contact: any = await app.getContactById(this.data.to);
      this.data.body = ["name", "pushname", "shortName"]
        .filter((title) => contact[title])
        .filter((title) => contact[title].trim() !== "")
        .reduce((acc, title) => {
          return acc ? acc.replace(reg, `${contact[title]}`) : acc;
        }, this.data.body);
      this.data.body = this.data.body?.replace(reg, "") || null;
    }
    return this;
  }

  async send() {
    if (/@c.us$/gi.test(this.data.to)) {
      await app.sendMessage(this.data.to, this.content, this.messageOptions);
    }
    return this;
  }

  async isRegisteredUser() {
    return await app.isRegisteredUser(this.data.to);
  }

  async destroy() {
    await super.destroy();
    this.reset();
  }

  async updateDataWithMsg(msg: msg) {
    this.data.from = msg.from;
    this.data.body = msg.body;
    this.data.type = msg.type;
    this.data.group = "SENDING";
    this.data.hasMedia = msg.hasMedia;
    if (this.data.hasMedia) {
      const media = await msg.downloadMedia();
      this.data.data = media.data;
      this.data.mimetype = media.mimetype;
    }
  }

  initialize() {
    this.addListener("data", (data) => {
      if (data.hasMedia && data.mimetype && data.data) {
        this._content = new MessageMedia(data.mimetype, data.data, data.body);
        switch (data.type) {
          case "ptt":
            this.messageOptions.sendAudioAsVoice = true;
            break;
          case "image":
            this.messageOptions.caption = data.body || undefined;
          default:
            break;
        }
      } else {
        this._content = data.body || "";
      }
    });
  }
}
