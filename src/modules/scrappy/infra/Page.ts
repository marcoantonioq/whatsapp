import puppeteer, {
  Page as PagePuppeteer,
  Browser as BrowserPuppeteer,
  PuppeteerLaunchOptions,
  ElementHandle,
  ScreenshotOptions,
  Viewport,
} from "puppeteer";

class Browser {
  private static instance: BrowserPuppeteer | null = null;
  private static pages: Set<PagePuppeteer> = new Set();

  static async launch(
    options?: PuppeteerLaunchOptions
  ): Promise<BrowserPuppeteer> {
    if (!Browser.instance) {
      Browser.instance = await puppeteer.launch({
        ...{
          userDataDir: "out/puppeteer-data",
          headless: true,
          executablePath: "/usr/bin/google-chrome-stable",
          args: [
            "--no-sandbox",
            "--disable-default-apps",
            "--disable-extensions",
            "--disable-setuid-sandbox",
            "--enable-features=NetworkService",
            "--ignore-certificate-errors",
            "--ignore-certificate-errors-spki-list",
            "--no-default-browser-check",
            "--no-experiments",
            "--disable-3d-apis",
            "--disable-accelerated-2d-canvas",
            "--disable-accelerated-jpeg-decoding",
            "--disable-accelerated-mjpeg-decode",
            "--disable-accelerated-video-decode",
            "--disable-app-list-dismiss-on-blur",
            "--disable-canvas-aa",
            "--disable-composited-antialiasing",
            "--disable-gl-extensions",
            "--disable-gpu",
            "--disable-histogram-customizer",
            "--disable-in-process-stack-traces",
            "--disable-site-isolation-trials",
            "--disable-threaded-animation",
            "--disable-threaded-scrolling",
            "--disable-webgl",
          ],
        },
        ...options,
      });
    }
    return Browser.instance;
  }

  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.close();
      this.instance = null;
      this.pages.clear();
    }
  }

  public static async createPage(
    options?: PuppeteerLaunchOptions
  ): Promise<PagePuppeteer> {
    const browser = await Browser.launch(options);
    const page = await browser.newPage();
    Browser.pages.add(page);
    return page;
  }

  public static async closePage(page: PagePuppeteer): Promise<void> {
    await page.close();
    Browser.pages.delete(page);
    if (Browser.pages.size === 0) {
      await Browser.close();
    }
  }
}

export class Page {
  private readonly page: PagePuppeteer;

  private constructor(page: PagePuppeteer) {
    this.page = page;
  }

  public static async create(
    headless: boolean = true,
    userDataDir: string = "out/puppeteer-data",
    executablePath: string = "/usr/bin/google-chrome-stable"
  ): Promise<Page> {
    return new Page(
      await Browser.createPage({ headless, userDataDir, executablePath })
    );
  }

  setDefaultNavigationTimeout(time: number) {
    this.page.setDefaultNavigationTimeout(time);
  }

  async navigate(url: string): Promise<void> {
    await this.page?.goto(url);
  }

  async awaitNavigation(): Promise<void> {
    await this.page?.waitForNavigation();
  }

  async awaitNetwork(time: number = 60): Promise<void> {
    await this.page?.waitForNetworkIdle({ idleTime: time });
  }

  async click(selector: string): Promise<void> {
    await this.page?.click(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    await this.page?.type(selector, text);
  }

  async screenshot(options?: ScreenshotOptions): Promise<Buffer | string> {
    return await this.page?.screenshot(options);
  }

  async screenshotBase64(options?: ScreenshotOptions): Promise<string> {
    const imageBuffer = await this.screenshot(options);
    return `data:image/png;base64,${imageBuffer?.toString("base64")}`;
  }

  async setContent(html: string) {
    await this.page?.setContent(html);
  }

  async $(selector: string): Promise<ElementHandle<Element> | null> {
    return await this.page.$(selector);
  }

  async evaluate<T>(fn: (args: any[]) => T, ...args: any[]): Promise<T> {
    const data = await this.page?.evaluate(fn, ...args);
    return data;
  }

  async insertHTML(selector: string, html: string): Promise<void> {
    await this.page?.evaluate(
      (selector, html) => {
        const element = document.querySelector(selector);
        if (element) element.innerHTML = html;
      },
      selector,
      html
    );
  }

  async setViewport(viewport: Viewport) {
    if (this.page) {
      await this.page.setViewport(viewport);
    }
  }

  async close(): Promise<void> {
    Browser.closePage(this.page);
  }
}

export default Page;