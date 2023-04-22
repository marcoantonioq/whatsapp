import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export interface payload {
    number: string;
    messagesID: string[];
}
export declare class ForwardMessages {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute({ number, messagesID }: payload): Promise<{
        msg: string;
        status: boolean;
        error: string;
    }>;
}
export default ForwardMessages;
