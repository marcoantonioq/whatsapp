import Page from "../infra/Page";

export class Navigation {
  constructor(private readonly repo: any) {}

  async execute(callback: (page: Page) => Promise<string>) {
    let result: string = "";
    try {
      const page = await Page.create();
      result = await callback(page);
      await page.close;
    } catch (error) {
      console.log("Erro ao navegar in page: ", error);
    }
    return result;
  }
}
export default Navigation;
