import GetText from "./app/text";
import { InterfaceRepository } from "./core/Request";
import { Repository as RepoOpenAI } from "./repo/repo-openai";
import { Repository as RepoWrite } from "./repo/repo-write-sonic";

type repos = "openAI" | "writeSonic";

export class ModuleRequest {
  private constructor(private readonly repo: InterfaceRepository) {}

  static create(repo: repos): ModuleRequest {
    switch (repo) {
      case "openAI":
        return new ModuleRequest(new RepoOpenAI([]));
      default:
        return new ModuleRequest(new RepoWrite([]));
    }
  }
  text = new GetText(this.repo).execute;
}

export default ModuleRequest;
