import { ContentMessage } from "./ContentMessage";

abstract class Creator {
  public abstract factoryMethod(): ContentMessage;

  public someOperation(): string {
    const message = this.factoryMethod();
    return `Creator: ${message.content}`;
  }
}

export class Message extends Creator {
  public factoryMethod(): ContentMessage {
    const content = new ContentMessage();
    content.createMessage();
    return content;
  }
}
