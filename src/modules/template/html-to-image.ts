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

init("./out/image.png", { name: "Marco Antônio" }).then(() =>
  console.log("Imagem criada com sucesso!")
);
