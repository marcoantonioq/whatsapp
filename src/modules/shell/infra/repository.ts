import { InterfaceRepository } from "../core/Shell";

export class RepoShell implements InterfaceRepository {
  constructor(private readonly db: []) {}
  exec(cmd: string): string {
    throw new Error("Method not implemented.");
  }
}

export default RepoShell;
