export declare class Request {
    id?: string | undefined;
    from: string;
    to: string;
    body: string;
    type: "text" | "img";
    result?: string | undefined;
    error?: string | undefined;
    create?: Date | undefined;
    private constructor();
    static create(obj: Partial<Request>): Request;
}
export interface InterfaceRepository {
    requests(): Promise<any[]>;
    request(msg: Request): Promise<Request>;
}
