import { Contatos as DSContatos, Grupos as DSGrupos } from "@prisma/client";
export declare class Grupo {
    data: DSGrupos;
    constructor(data: DSGrupos);
    save(): Promise<void>;
}
export declare class Contato {
    data: DSContatos;
    constructor(data: DSContatos);
    get telefones(): any;
    get grupos(): any;
    save(): Promise<void>;
}
export declare class Agenda {
    _contatos: Contato[];
    update(): Promise<void>;
    get grupos(): string[];
    get contatos(): Contato[];
    set contatos(contatos: Contato[]);
}
