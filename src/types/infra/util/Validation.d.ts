export declare class Validation {
    to: string;
    private regex;
    private sanitizer;
    private validation;
    private message;
    private _value;
    constructor({ to, regex, sanitizer, validation, message, value, }: {
        to: string;
        message?: string;
        regex?: RegExp;
        sanitizer?: Function;
        validation?: Function;
        value?: any;
    });
    get value(): any;
    set value(value: any);
    valid(value: any): void;
}
