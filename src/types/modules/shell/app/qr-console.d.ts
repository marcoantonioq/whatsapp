import { InterfaceRepository } from "../core/Shell";
export declare class QrConsole {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(qr: string): Promise<void>;
}
export default QrConsole;
