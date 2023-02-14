import { Group, Messages } from "@prisma/client";
import { MessageSendOptions } from "whatsapp-web.js";

export class Message implements Messages {
  messageOptions: MessageSendOptions = {};

  private constructor(
    public from: string | null = "",
    public to = "",
    public body: string | null = "",
    public type: string | null = "",
    public group = <Group | null>"SENDING",
    public hasMedia: boolean | null = false,
    public mimetype: string | null = "",
    public data: string | null = "",
    public serialized = "",
    public notifyName = "",
    public self = "",
    public caption = "",
    public old = "",
    public info = "",
    public status = true,
    public created = new Date(),
    public modified = new Date(),
    public id = 0
  ) {}
  static create(msg: Partial<Messages>) {
    const message = new Message(
      msg.from,
      msg.to,
      msg.body,
      msg.type,
      "SENDING",
      msg.hasMedia,
      msg.mimetype,
      msg.data
    );
    return message;
  }

  async destroy() {}

  get dto() {
    return {
      id: this.id,
      to: this.to,
      serialized: this.serialized,
      body: this.body,
      from: this.from,
      group: this.group,
      notifyName: this.notifyName,
      self: this.self,
      caption: this.caption,
      mimetype: this.mimetype,
      type: this.type,
      data: this.data,
      old: this.old,
      info: this.info,
      status: this.status,
      hasMedia: this.hasMedia,
      created: this.created,
      modified: this.modified,
    };
  }
}

export interface InterfaceRepository {
  list(): Promise<Message[]>;
  add(msg: any): Promise<Boolean>;
}
