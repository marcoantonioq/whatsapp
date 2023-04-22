/// <reference types="node" />
import EventEmitter from "events";
import { Message } from "../core/Message";
import { InterfaceRepository, SendMessageRequest } from "../interfaces/InterfaceRepository";
export declare class RepositoryWPPConnect implements InterfaceRepository {
    private readonly data;
    private socket;
    constructor(data: Message[]);
    readonly event: EventEmitter;
    messages(): Promise<Message[]>;
    sendMessage(request: SendMessageRequest): Promise<Message>;
    delete(chatID: string, messageID: string): Promise<boolean>;
    forwardMessages(to: string, ids: string[], skipMyMessages?: boolean | undefined): Promise<boolean>;
    clear(chatID: string): Promise<boolean>;
    download(messageID: string): Promise<string>;
    initialize(): Promise<boolean>;
}
