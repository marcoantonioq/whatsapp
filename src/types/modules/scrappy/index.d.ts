export declare class ModuleScrapy {
    private constructor();
    static create(): ModuleScrapy;
    private readonly repo;
    printScreenPage: (page: Partial<import("./core/Page").Page>, out?: string | undefined) => Promise<string | undefined>;
    createPageTemplate: (template?: "default" | "aviso" | "comunicado", entries?: [string, string][] | undefined) => Promise<string>;
}
