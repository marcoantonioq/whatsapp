/// <reference types="node" />
import { exec as execChild } from "child_process";
export declare const exec: typeof execChild.__promisify__;
export declare class ShellLinux {
    static exec(cmd: string): Promise<string>;
}
export interface InterfaceRepository {
    exec(cmd: string): string;
}
