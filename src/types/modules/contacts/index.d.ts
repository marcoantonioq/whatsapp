export declare class ModuleContacts {
    private constructor();
    static create(): ModuleContacts;
    private readonly repo;
    upGoogleSheetToContact: () => Promise<import("./core/Contacts").Contact[]>;
    contacts: () => Promise<import("./core/Contacts").Contact[]>;
    onCreate: (listener: (contact: import("./core/Contacts").Contact) => void) => Promise<void>;
}
