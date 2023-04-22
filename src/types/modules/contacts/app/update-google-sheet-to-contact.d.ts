import { Contact, InterfaceRepository } from "../core/Contacts";
export declare class UpGoogleSheetToContact {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(): Promise<Contact[]>;
}
export default UpGoogleSheetToContact;
