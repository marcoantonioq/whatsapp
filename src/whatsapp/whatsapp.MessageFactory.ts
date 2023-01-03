import { Messages as DBMessages } from "@prisma/client";
import {
  MessageContent,
  MessageMedia,
  MessageSendOptions,
} from "whatsapp-web.js";

export class MessageFactory {
  _content: MessageContent = "";
  messageOptions: MessageSendOptions = {};

  constructor(data: DBMessages) {
    this.createMessage(data);
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }

  createMessage(data: DBMessages) {
    try {
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
        this.content = data.body || "";
      }
      return this.content;
    } catch (e) {
      console.error("Error createMsgSend: ", e);
      return undefined;
    }
  }
}
