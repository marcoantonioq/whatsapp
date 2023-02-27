import { Group, Messages } from "@prisma/client";
import EventEmitter from "events";

export class Message implements Messages {
  messageOptions = {};

  private constructor(
    public from: string | null = "",
    public to = "",
    public body: string | null = "",
    public type: string | null = "text",
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
    public id = "",
    public isBot = true
  ) {}
  static create(msg: Partial<Message>): Message {
    const message = Object.assign(new Message(), { ...msg });
    if (message.body) message.setBody(message.body);
    return message;
  }

  setBody(body: string) {
    this.body = body;
    if (body.startsWith("🤖: ")) this.isBot = true;
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

interface Contact {
  id: string;
  name: string | undefined;
  isMyContact: boolean;
  isBusiness: boolean;
  shortName: string;
  pushname: string | undefined;
  labels: any[];
}
export interface InterfaceRepository {
  event: EventEmitter;
  messages(): Promise<Message[]>;
  send(msg: Message): Promise<Boolean>;
  delete(chatID: string, messageID: string): Promise<Boolean>;
  forward(to: string, msgsIDs: string[]): Promise<Boolean>;
  clear(chatID: string): Promise<Boolean>;
  contact(contactID: string): Promise<Contact>;
}
