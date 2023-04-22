import { InterfaceRepository } from "../interfaces/InterfaceRepository";
export declare class OnQR {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(listener: (qr: string) => void): Promise<void>;
}
export default OnQR;
