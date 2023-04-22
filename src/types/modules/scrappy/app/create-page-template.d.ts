import { InterfaceRepository } from "../core/Page";
declare const layouts: {
    default: string;
    aviso: string;
    comunicado: string;
};
export type templates = keyof typeof layouts;
export declare class CreatePageTemplate {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(template?: templates, entries?: [string, string][]): Promise<string>;
}
export default CreatePageTemplate;
