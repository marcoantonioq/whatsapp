import { InterfaceRepository } from "../core/Contacts";
export declare class Contacts {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(): Promise<import("../core/Contacts").Contact[]>;
}
export default Contacts;
