import { InterfaceRepository, Page } from "../core/Page";
import { promises as fs } from "fs";

export class PrintScreenPage {
  constructor(private readonly repo: InterfaceRepository) {}

  async execute(page: Partial<Page>, out?: string) {
    const layout = await fs.readFile(
      "src/modules/scrappy/app/layouts/default.html",
      "utf-8"
    );
    if (page.templateHTML)
      page.templateHTML = layout.replaceAll("{{content}}", page.templateHTML);
    const newPage = Page.create(page);
    try {
      const imgBuffer = await this.repo.printScreen(newPage);
      if (out) await fs.writeFile(out, imgBuffer);
      return imgBuffer;
    } catch (e) {
      console.log("Erro ao baixar imagem::", e);
    }
  }
}
export default PrintScreenPage;
