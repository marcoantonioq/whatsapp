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
  const html = await scrapy.createPageTemplate("aviso", [
    [
      "content",
      `
<h1>REUNIÃO DE EVANGELIZAÇÃO</h1>
<h2>HOJE - 19H30</h2>
<span class="center"><b>Casa do Ir. Walter & Ir. Simone</b>Região da Barra</span>
<cite>
Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.
<br />- Mateus 11:28
</cite>
<small>
  <b>Próxima reunião:</b>
  07/03 às 19h30 Ir. Cristina
  Portal da Serra
</small>
  `,
    ],
  ]);

  scrapy.printScreenPage({ templateHTML: html }, "./out/image.png");
})();
