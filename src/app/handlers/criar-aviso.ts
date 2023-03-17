import { layouts as PageLayouts } from "@modules/scrappy/app/create-page-template";
import { questionAPI, scrapy, sendImgToAPI, whatsappToHtml } from ".";

export async function criarAviso(input: string = ""): Promise<string> {
  const types = Object.keys(PageLayouts);
  let menu: string = types.map((el, id) => `${1 + id}. ${el}`).join("\n");
  let select: number = Number(
    (
      await questionAPI(
        `Informe o tipo de aviso que deseja [(s)sair]: \n${menu}`
      )
    ).body
  );
  const type = types[select - 1];
  while (true) {
    try {
      const aviso = await questionAPI(
        `Aviso selecionado: ${type}\n\nInforme o texto [(s)sair]:`
      );

      if (/^(s|sair)$/gi.test(aviso.body || "")) break;

      if (aviso.body) {
        const html = await scrapy.createPageTemplate(
          <keyof typeof PageLayouts>type,
          [["content", whatsappToHtml(aviso.body)]]
        );

        const data = await scrapy.createImageWithHTMLCode(
          html,
          "./out/image.png"
        );
        // const caption = await questionAPI("Informe o caption: ");
        if (data) await sendImgToAPI(data);
      }
    } catch (error) {
      console.log("Erro ao criar aviso: ", error);
    }
  }
  return "Aviso criado!";
}
