import { InterfaceRepository } from "../core/Page";
import { Browser } from "puppeteer";

export class Navigation {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(callback: (browser: Browser) => Promise<string | undefined>) {
    if (this.repo.browser) {
      return await callback(this.repo.browser);
    } else {
      console.log("Navegador não iniciado: ", this.repo.browser);
    }
  }
}
export default Navigation;
