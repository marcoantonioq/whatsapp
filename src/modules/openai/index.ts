import GetText from "./app/text";
import { Repository } from "./repo/repo";

export class ModuleOpenAI {
  private constructor() {}

  static create(): ModuleOpenAI {
    if (!ModuleOpenAI.instance) {
      ModuleOpenAI.instance = new ModuleOpenAI();
    }
    return ModuleOpenAI.instance;
  }
  // private event = new EventEmitter();
  private static instance: ModuleOpenAI;
  private readonly repo: Repository = new Repository([]);
  text = new GetText(this.repo).execute;
}

export default ModuleOpenAI;
