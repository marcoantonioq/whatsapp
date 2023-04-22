import { InterfaceRepository } from "../core/Shell";
export declare class RepoShell implements InterfaceRepository {
    private readonly db;
    constructor(db: []);
    exec(cmd: string): string;
}
export default RepoShell;
