/// <reference types="node" />
import { EventEmitter } from "stream";
import { Contact, InterfaceRepository } from "../core/Contacts";
export declare class Repository implements InterfaceRepository {
    private readonly data;
    constructor(data: Contact[]);
    readonly event: EventEmitter;
    clean(): Promise<Boolean>;
    contacts(): Promise<Contact[]>;
    getContactByPhone(number: string): Promise<Contact>;
    save(contact: Contact): Promise<Boolean>;
    delete(contact: Contact): Promise<Boolean>;
}
