export declare class GetValuesInSheet {
    private readonly repo?;
    constructor(repo?: any);
    execute(spreadsheetId: string, range: string): Promise<any>;
}
export default GetValuesInSheet;
