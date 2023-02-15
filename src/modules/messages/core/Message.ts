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
    public displayName = "",
    public self = "",
    public caption = "",
    public old = "",
    public info = "",
    public status = true,
    public created = new Date(),
    public modified = new Date(),
    public id = ""
  ) {}
  static create(msg: Partial<Messages>): Message {
    return Object.assign(new Message(), { ...msg });
  }

  async destroy() {}

  get dto() {
    return <Messages>{
      id: this.id,
      to: this.to,
      serialized: this.serialized,
      body: this.body,
      from: this.from,
      group: this.group,
      notifyName: this.notifyName,
      displayName: this.displayName,
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
