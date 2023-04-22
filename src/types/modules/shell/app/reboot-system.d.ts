import { InterfaceRepository } from "../core/Shell";
export declare class RebootSystem {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(): Promise<void>;
}
export default RebootSystem;
