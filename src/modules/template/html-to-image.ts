import nodeHtmlToImage from "node-html-to-image";
import { promises } from "fs";

const init = async () => {
  const html = await promises.readFile(
    "src/modules/template/index.html",
    "utf-8"
  );
  nodeHtmlToImage({
    output: "./out/image.png",
    html: html,
    content: { name: "Marco Antônio" },
  }).then(() => console.log("Imagem criada com sucesso!"));
};

init();
