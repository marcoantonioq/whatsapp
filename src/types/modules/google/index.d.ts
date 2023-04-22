export declare class ModuleGoogle {
    private constructor();
    static create(): ModuleGoogle;
    private event;
    private static instance;
    private readonly repo;
    sheet: {
        saveValues: ({ range, values, spreadsheetId }: import("../../types").GOOGLE_SHEET_SAVE) => Promise<any>;
        getValues: (spreadsheetId: string, range: string) => Promise<any>;
    };
    search: {
        text: (text: string) => Promise<string>;
    };
    speech: {
        oggToText: (mediaBase64: string) => Promise<string>;
    };
}
export default ModuleGoogle;
