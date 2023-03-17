import Navigation from "./app/navigation";
import CreatePageTemplate from "./app/create-page-template";
import CreateImageWithHTMLCode from "./app/create-image-with-html-code";

export class ModuleScrapy {
  private constructor() {}

  static create(): ModuleScrapy {
    return new ModuleScrapy();
  }
  private readonly repo = [];
  createImageWithHTMLCode = new CreateImageWithHTMLCode(this.repo).execute;
  createPageTemplate = new CreatePageTemplate(this.repo).execute;
  navigation = new Navigation(this.repo).execute;
}
