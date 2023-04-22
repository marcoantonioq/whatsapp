import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class OnReady {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(listener: () => void): Promise<void>;
}
export default OnReady;
