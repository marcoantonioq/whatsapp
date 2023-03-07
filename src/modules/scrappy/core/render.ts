// const minhaString: string = `Horário: HOJE - 19H30
//   Local: Casa da Ir. Domingas - Papyrus
//   Outras: Outras informações`;

// const meuArray: { action: string; key: string; value: string }[] = [];

// const regex = /^([^:]+):\s*([\s\S]+?)(?=\n[a-zA-Z]|$)/gm;

// let match;

// while ((match = regex.exec(minhaString))) {
//   const action: string = match[1].trim().toLowerCase().replace(/\s+/g, "_");
//   const key: string = match[1].trim();
//   const value: string = match[2].trim();
//   meuArray.push({ action, key, value });
// }

import { ModuleScrapy } from "../index";

/**
 * demo
 */
export const scrapy = ModuleScrapy.create();
(async () => {
  const msg = ` `
    .trim()
    .split("\n")
    .map((el) => el.trim())
    .map((el, id) => (el.match(/^\</gi) && !id ? el : `<br>${el}</br>`))
    .join("");

  console.log(msg);

  const html = await scrapy.createPageTemplate("aviso", [["content", msg]]);

  scrapy.printScreenPage({ templateHTML: html }, "./out/image.png");
})();
