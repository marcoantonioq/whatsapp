import { Whatsapp } from "..";
import { Message } from "./Message";
export declare class Chats {
    private messages;
    private events;
    private constructor();
    static create(messages: Whatsapp): Chats;
    question(text: string, chatID: string): Promise<Message>;
}
