import { InterfaceRepository, Contact } from "../core/Contacts";
export declare class OnCreateMessage {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(listener: (contact: Contact) => void): Promise<void>;
}
export default OnCreateMessage;
