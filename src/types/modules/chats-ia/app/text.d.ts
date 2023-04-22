import { InterfaceRepository, Request } from "../core/Request";
export declare class GetText {
    private readonly repo;
    constructor(repo: InterfaceRepository);
    execute(text: Request): Promise<Request>;
}
export default GetText;
