type repos = "openAI" | "writeSonic";
export declare class ModuleChatsAI {
    private readonly repo;
    private constructor();
    static create(repo: repos): ModuleChatsAI;
    text: (text: import("./core/Request").Request) => Promise<import("./core/Request").Request>;
}
export default ModuleChatsAI;
