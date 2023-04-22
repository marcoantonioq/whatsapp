import { InterfaceRepository, Page } from "../core/Page";
export declare class PrintScreenPage {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(page: Partial<Page>, out?: string): Promise<string | undefined>;
}
export default PrintScreenPage;
