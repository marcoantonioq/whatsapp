import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class StateWhatsapp {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(state: string, session?: string): Promise<void>;
}
export default StateWhatsapp;
