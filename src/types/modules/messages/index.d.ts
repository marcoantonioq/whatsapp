export declare class Whatsapp {
    private constructor();
    static create(): Whatsapp;
    private readonly repo;
    clearChat: (chatID: string) => Promise<void>;
    forwardMessages: ({ number, messagesID }: import("./app/forward-messages").payload) => Promise<{
        msg: string;
        status: boolean;
        error: string;
    }>;
    getContact: (contactID: string) => Promise<import("./core/Message").Contact | undefined>;
    onMessage: (listener: (msg: import("./core/Message").Message) => void) => Promise<void>;
    onQR: (listener: (qr: string) => void) => Promise<void>;
    onReady: (listener: () => void) => Promise<void>;
    stateMessages: (state: string, session?: string | undefined) => Promise<void>;
    downloadMedia: (messageID: string) => Promise<string>;
    sendMessage: (request: import("./interfaces/InterfaceRepository").SendMessageRequest) => Promise<import("./core/Message").Message>;
}
