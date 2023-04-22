/**
 * Interfaces
 */
export interface menu {
    label: string;
    regex?: string;
    action: (input: string) => Promise<string | undefined>;
}
/**
 * Class
 */
export declare class Menu {
    options: menu[];
    constructor(options: menu[]);
    menu(): string;
    selectOption(input: string): Promise<string | undefined>;
}
