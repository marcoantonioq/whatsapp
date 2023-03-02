import GetText from "./app/text";
import { InterfaceRepository } from "./core/Request";
import { Repository as RepoOpenAI } from "./repo/repo-openai";
import { Repository as RepoWrite } from "./repo/repo-write-sonic";

type repos = "openAI" | "writeSonic";

export class ModuleChatsAI {
  private constructor(private readonly repo: InterfaceRepository) {}

  static create(repo: repos): ModuleChatsAI {
    switch (repo) {
      case "openAI":
        return new ModuleChatsAI(new RepoOpenAI([]));
      default:
        return new ModuleChatsAI(new RepoWrite([]));
    }
  }
  text = new GetText(this.repo).execute;
}

export default ModuleChatsAI;
