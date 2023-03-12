export class Page {
  private constructor(
    public url: string = "",
    public templateHTML: string | undefined = undefined
  ) {}
  static create(page: Partial<Page>) {
    return Object.assign(new Page(), { ...page });
  }
}

export interface InterfaceRepository {
  pages(): Promise<Page[]>;
  create(page: Page): Promise<Page>;
  printScreenBase64Data(page: Page): Promise<string>;
}
