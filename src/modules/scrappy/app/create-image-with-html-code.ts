import Page from "../infra/Page";

export class CreateImageWithHTMLCode {
  constructor(private readonly repo: any) {}

  async execute(
    html: string,
    path?: string,
    width: number = 400,
    height: number = 720
  ) {
    let image = "";
    const page = await Page.create();
    try {
      await page.setViewport({
        width,
        height,
      });
      await page.setContent(html);
      image = await page.screenshotBase64({
        path,
      });
    } catch (error) {
      console.log("Erro ao criar imagem: ", error);
    }
    page.close();
    return image;
  }
}
export default CreateImageWithHTMLCode;
