/// <reference types="node" />
import EventEmitter from "events";
export declare enum Events {
    AUTHENTICATED = "authenticated"
}
declare class Google extends EventEmitter {
    private static instance;
    private authenticated;
    client: any;
    private constructor();
    static create(): Google;
    auth(auth: any): Promise<any>;
    get spreadsheets(): any;
    get people(): any;
    get speech(): any;
    get search(): any;
    get storage(): any;
}
export default Google;
