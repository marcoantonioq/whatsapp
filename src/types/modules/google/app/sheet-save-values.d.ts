import { GOOGLE_SHEET_SAVE } from "@types";
export declare class SaveValues {
    private readonly repo?;
    constructor(repo?: any);
    execute({ range, values, spreadsheetId }: GOOGLE_SHEET_SAVE): Promise<any>;
}
export default SaveValues;
