import { Message } from "../core/Message";
import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class OnCreateMessage {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(listener: (msg: Message) => void): Promise<void>;
}
export default OnCreateMessage;
