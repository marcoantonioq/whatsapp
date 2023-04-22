import EventEmitter from "events";

type Messages = {};
type Group = "SENDING" | null;

export class Message implements Messages {
  messageOptions = {};

  private constructor(
    public from: string | null = "",
    public to = "",
    public body: string | null = "",
    public type: string | null = "text",
    public group = <Group>"SENDING",
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
    public isGroup = false,
    public author = "",
    public isMe = false,
    public isMyContact = false
  ) {}
  static create(msg: Partial<Message>): Message {
    const message = Object.assign(new Message(), { ...msg });
    if (message.body) message.setBody(message.body);
    return message;
  }

  static createRecord(msg: any): Message {
    const message = Message.create({}) as any;
    const sender: any = msg.sender;
    for (const [key, value] of Object.entries(msg)) {
      if (value && message.hasOwnProperty(key)) {
        message[key as keyof Message] = msg[key];
      }
    }
    // console.log(">>>>", msg);
    message.isGroup = msg?.isGroupMsg;
    message.hasMedia = msg?.isMedia;
    message.displayName = sender?.name || "";
    message.isMe = sender?.isMe;
    message.isMyContact = sender?.isMyContact;
    return <Message>message;
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
