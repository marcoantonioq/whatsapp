import puppeteer from "puppeteer";
import { promises as fs } from "fs";

const init = async (output: string, values: any) => {
  let html = await fs.readFile("src/modules/template/index.html", "utf-8");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const keys = Object.keys(values);
  for (const key of keys) {
    html = html.replaceAll(`{{${key}}}`, values[key]);
  }
  await page.setContent(html);
  const content = await page.$("body");
  if (content) {
    const imageBuffer = await content.screenshot();
    await page.close();
    await browser.close();
    await fs.writeFile("./out/image.png", imageBuffer);
    return imageBuffer;
  }
};

const content = `
      <h1>REUNIÃO DE EVANGELIZAÇÃO</h1>
      <h2>HOJE - 19H30</h2>
      <span> Casa da Ir. Domingas - Papyrus</span>
      <cite>
        Deus é o nosso refúgio e nossa fortaleza, socorro bem presente nas
        angústias. Portanto não temeremos, ainda que a terra se mude, e ainda
        que os montes se transportem para o meio dos mares. Ainda que as águas
        tumultuem e se turvem, ainda que os montes se abalem com o seu fragor.
        <br />
        - Salmo 46
      </cite>
      <small>
        <b>Próximas reuniões:</b>
        07/03 às 19h30 Ir. Cristina - Portal da Cerra </br>        
        12/03 às 14h30 Ir. Ari - São Carlos </br>
        14/03 às 19h30 Ir. Francisco - Papyrus </br>
        21/03 às 19h30 Ir. Sebastião - Jardim das Acácias
      </small>
    `;

init("./out/image.png", { name: "Marco Antônio", content: content }).then(() =>
  console.log("Imagem criada com sucesso!")
);
