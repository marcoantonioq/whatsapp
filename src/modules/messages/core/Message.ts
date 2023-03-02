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
    public isBot = true,
    public isGroup = false
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

export interface Contact {
  id: string;
  isBusiness: boolean;
  isMyContact: boolean;
  isUser: boolean;
  isWAContact: boolean;
  labels: any[];
  pushname: string | undefined;
  shortName: string;
}
export interface InterfaceRepository {
  event: EventEmitter;
  messages(): Promise<Message[]>;
  send(msg: Message): Promise<boolean>;
  delete(chatID: string, messageID: string): Promise<boolean>;
  forwardMessages(
    to: string,
    ids: string[],
    skipMyMessages?: boolean
  ): Promise<boolean>;
  clear(chatID: string): Promise<boolean>;
  download(messageID: string): Promise<string>;
  getContact(contactID: string): Promise<Contact | undefined>;
  initialize(): Promise<boolean>;
}
