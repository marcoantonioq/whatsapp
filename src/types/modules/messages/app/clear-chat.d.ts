export declare class ClearChat {
    private readonly repo?;
    constructor(repo?: any);
    execute(chatID: string): Promise<void>;
}
export default ClearChat;
