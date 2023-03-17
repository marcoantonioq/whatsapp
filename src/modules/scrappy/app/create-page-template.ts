import { promises as fs } from "fs";

export const layouts = {
  default: "src/modules/scrappy/app/layouts/default.html",
  aviso: "src/modules/scrappy/app/layouts/aviso.html",
  center: "src/modules/scrappy/app/layouts/center.html",
};
export type templates = keyof typeof layouts;

export class CreatePageTemplate {
  constructor(private readonly repo: any) {}

  async execute(template: templates = "default", entries?: [string, string][]) {
    const html = await fs.readFile(layouts[template], "utf-8");
    if (entries)
      return entries
        .reduce((acc, [key, val]) => {
          return acc.replaceAll(`{{${key}}}`, val);
        }, html)
        .replaceAll(/\{\{[a-z]+\}\}/gi, "");
    return html;
  }
}
export default CreatePageTemplate;
