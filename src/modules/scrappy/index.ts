import Navigation from "./app/navigation";
import CreatePageTemplate from "./app/create-page-template";
import PrintScreenPage from "./app/printscreen-page";
import { RepositoryPuppeteer } from "./repo/repo-puppeteer";

export class ModuleScrapy {
  private constructor() {}

  static create(): ModuleScrapy {
    return new ModuleScrapy();
  }
  private readonly repo = new RepositoryPuppeteer([]);
  printScreenPage = new PrintScreenPage(this.repo).execute;
  createPageTemplate = new CreatePageTemplate(this.repo).execute;
  navigation = new Navigation(this.repo).execute;
}
