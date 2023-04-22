import { InterfaceRepository, Request } from "../core/Request";
export declare class Repository implements InterfaceRepository {
    private readonly data;
    constructor(data: Request[]);
    dialogs(): Promise<Request[]>;
    requests(): Promise<Request[]>;
    request(request: Request): Promise<Request>;
}
