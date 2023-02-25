import { request } from "../repo/repo";

export class Dialog {
  private constructor(
    public id = "",
    public from: string | null = "",
    public to = "",
    public type: string | null = "text",
    public messages: request[] = [],
    public error: string | null = ""
  ) {}
  static create(obj: Partial<Dialog>) {
    return <Dialog>Object.assign(new Dialog(), { ...obj });
  }
}

export interface InterfaceRepository {
  requests(): Promise<any[]>;
  request(msg: request): Promise<request>;
}
