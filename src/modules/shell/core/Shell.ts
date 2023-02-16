import util from "util";
import { exec as execChild } from "child_process";
export const exec = util.promisify(execChild);

export class ShellLinux {
  static async exec(cmd: string) {
    const { stdout, stderr } = await exec(cmd);
    if (stderr) throw `Erro shell stderr: ${stderr}`;
    return stdout.trim();
  }
}

export interface InterfaceRepository {
  exec(cmd: string): string;
}
