import { ContentMessage } from "./ContentMessage";

abstract class Creator {
  public abstract factoryMethod(): Promise<ContentMessage>;

  async someOperation(): Promise<string> {
    const message = await this.factoryMethod();
    return `Creator: ${message.content}`;
  }
}

export class Message extends Creator {
  public async factoryMethod(): Promise<ContentMessage> {
    const content = new ContentMessage();
    await content.createMessage();
    return content;
  }
}
