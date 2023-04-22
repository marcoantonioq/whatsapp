type Messages = {};
type Group = "SENDING" | null;
export declare class Message implements Messages {
    from: string | null;
    to: string;
    body: string | null;
    type: string | null;
    group: Group;
    hasMedia: boolean | null;
    mimetype: string | null;
    data: string | null;
    serialized: string;
    notifyName: string;
    displayName: string;
    self: string;
    caption: string;
    old: string;
    info: string;
    status: boolean;
    created: Date;
    modified: Date;
    id: string;
    isBot: boolean;
    isGroup: boolean;
    author: string;
    isMe: boolean;
    isMyContact: boolean;
    messageOptions: {};
    private constructor();
    static create(msg: Partial<Message>): Message;
    static createRecord(msg: any): Message;
    setBody(body: string): void;
    destroy(): Promise<void>;
    get dto(): Messages;
}
export interface Contact {
    id: string;
    isBusiness: boolean;
    isMyContact: boolean;
    isUser: boolean;
    isWAContact: boolean;
    labels: any[];
    pushname: string | undefined;
    shortName: string;
}
export {};
