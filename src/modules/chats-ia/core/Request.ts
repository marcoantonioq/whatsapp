export class Request {
  private constructor(
    public id?: string,
    public from = "",
    public to = "",
    public body = "",
    public type: "text" | "img" = "text",
    public result?: string,
    public error?: string,
    public create?: Date
  ) {}
  static create(obj: Partial<Request>) {
    return <Request>Object.assign(new Request(), { ...obj });
  }
}

export interface InterfaceRepository {
  requests(): Promise<any[]>;
  request(msg: Request): Promise<Request>;
}
