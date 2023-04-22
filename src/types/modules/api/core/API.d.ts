/// <reference types="node" />
/// <reference types="node" />
import { Agenda } from "../../contacts/core/Contacts";
import { Message } from "../../messages/core/Message-bkp";
import { Client, Message as msg } from "whatsapp-web.js";
import Events from "events";
/**
 * Grupo API do whatsapp 🤖
 */
export declare class API extends Events {
    private _locks;
    private _numbers;
    timeOut: NodeJS.Timeout[];
    mensagens: Message[];
    app: Client;
    agenda: Agenda;
    constructor(app: Client, agendas: Agenda);
    get locks(): number;
    get numbers(): string;
    set numbers(numbers: string);
    arrayNumbers(): string[];
    numbersToString(delimitador?: string): string;
    isToAPI(msg: msg): boolean;
    isEnable(text: string): boolean;
    enable(text: string): void;
    disable(text: string): void;
    sendToAPI(text: string, delay?: number): Promise<void>;
    reset(): Promise<void>;
    toString(): this;
    getGruposContatos(gruposInformados: string): string;
    private command;
    reboot(): void;
    hello(): void;
    initialize(): void;
}
export default API;
