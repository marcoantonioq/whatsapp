import { Message } from "../core/Message";
import { InterfaceRepository, SendMessageRequest } from "../interfaces/InterfaceRepository";
export declare class SendMessage {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(request: SendMessageRequest): Promise<Message>;
}
