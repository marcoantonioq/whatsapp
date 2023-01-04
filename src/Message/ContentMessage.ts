import { DataBase } from "./DabaBase";
import { Messages } from "@prisma/client";
import {
  MessageContent,
  MessageMedia,
  MessageSendOptions,
} from "whatsapp-web.js";
import { formatWhatsapp } from "../phone";

export class ContentMessage extends DataBase {
  private _content: MessageContent | undefined;
  messageOptions: MessageSendOptions = {};

  constructor(data?: Messages) {
    super(data);
  }
  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }

  async createMessage(data: Messages | undefined) {
    if (data) {
      if (this.data) this.data.to = formatWhatsapp(data.to);
      if (data.hasMedia && data.mimetype && data.data) {
        this.content = new MessageMedia(data.mimetype, data.data, data.body);
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
      }
      console.log("Não foi possível criar mensagem: ");
    }
  }

  async send() {
    const reg = /_NOME/gi;
    if (this.data && this.data.to) {
      const contact: any = await app.getContactById(this.data.to);
      if (!this.data.hasMedia) {
        this.data.body = ["name", "pushname", "shortName"]
          .filter((title) => contact[title])
          .filter((title) => contact[title].trim() !== "")
          .reduce((acc, title) => {
            return acc ? acc.replace(reg, ` ${contact[title]}`) : acc;
          }, this.data.body);
      }
      app.sendMessage(this.data.to, this.content, this.messageOptions);
    }
  }
}
