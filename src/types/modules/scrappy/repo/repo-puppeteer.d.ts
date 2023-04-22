import { InterfaceRepository, Page } from "../core/Page";
export declare class RepositoryPuppeteer implements InterfaceRepository {
    readonly data: Page[];
    constructor(data: Page[]);
    pages(): Promise<Page[]>;
    create(page: Page): Promise<Page>;
    printScreenBase64Data(page: Page): Promise<string>;
}
