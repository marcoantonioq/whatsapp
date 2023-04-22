import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class DownloadMedia {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(messageID: string): Promise<string>;
}
export default DownloadMedia;
