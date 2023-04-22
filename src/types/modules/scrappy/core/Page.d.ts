export declare class Page {
    url: string;
    templateHTML: string | undefined;
    private constructor();
    static create(page: Partial<Page>): Page & {
        url?: string | undefined;
        templateHTML?: string | undefined;
    };
}
export interface InterfaceRepository {
    pages(): Promise<Page[]>;
    create(page: Page): Promise<Page>;
    printScreenBase64Data(page: Page): Promise<string>;
}
