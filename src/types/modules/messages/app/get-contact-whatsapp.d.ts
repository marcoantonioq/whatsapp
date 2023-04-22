import { Contact } from "../core/Message";
import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class GetContactWhatsapp {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(contactID: string): Promise<Contact | undefined>;
}
export default GetContactWhatsapp;
