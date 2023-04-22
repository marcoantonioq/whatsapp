/// <reference types="node" />
import EventEmitter from "events";
import { Message } from "../core/Message";
import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class RepositoryMessages implements InterfaceRepository {
    private readonly data;
    constructor(data: Message[]);
    readonly event: EventEmitter;
    messages(): Promise<Message[]>;
    sendMessage(msg: Message): Promise<boolean>;
    delete(chatID: string, messageID: string): Promise<boolean>;
    forwardMessages(to: string, ids: string[], skipMyMessages?: boolean | undefined): Promise<boolean>;
    clear(chatID: string): Promise<boolean>;
    download(messageID: string): Promise<string>;
    initialize(): Promise<boolean>;
}
