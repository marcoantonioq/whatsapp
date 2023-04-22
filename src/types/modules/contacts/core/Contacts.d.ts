/// <reference types="node" />
import { Contatos as DSContatos, Grupos as DSGrupos } from "@prisma/client";
import EventEmitter from "events";
export declare class Group implements DSGrupos {
    nome: string;
    constructor(nome: string);
    toJSON(): string;
}
export declare class Contact implements DSContatos {
    id: string;
    nome: string;
    notas: string | null;
    private _telefones;
    grupos: string | null;
    aniversario: string | null;
    email: string | null;
    address: string | null;
    status: boolean | null;
    datas: Date | null;
    modified: Date | null;
    created: Date | null;
    selected: boolean;
    isSaved: boolean;
    isUser: boolean;
    isGroup: boolean;
    isWhatsapp: boolean;
    isContact: boolean;
    isBusiness: boolean;
    update: boolean;
    constructor(id?: string, nome?: string, notas?: string | null, _telefones?: string, grupos?: string | null, aniversario?: string | null, email?: string | null, address?: string | null, status?: boolean | null, datas?: Date | null, modified?: Date | null, created?: Date | null, selected?: boolean, isSaved?: boolean, isUser?: boolean, isGroup?: boolean, isWhatsapp?: boolean, isContact?: boolean, isBusiness?: boolean);
    static create(contact: Partial<Contact>): Contact;
    get telefones(): string;
    set telefones(telefones: string);
    setGrupos(grupos: string): void;
    isInTheGroup(grupo: string): boolean;
    getJSON(): string;
}
export interface InterfaceRepository {
    event: EventEmitter;
    contacts(): Promise<Contact[]>;
    save(contato: Contact): Promise<Boolean>;
    delete(contato: Contact): Promise<Boolean>;
    clean(): Promise<Boolean>;
}
