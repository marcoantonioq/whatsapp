import puppeteer, { Browser } from "puppeteer";
import { InterfaceRepository, Page } from "../core/Page";

export class RepositoryPuppeteer implements InterfaceRepository {
  static _browser: Browser | undefined = undefined;
  constructor(public readonly data: Page[]) {
    this.initialize();
  }

  async pages() {
    return this.data;
  }

  get browser() {
    return RepositoryPuppeteer._browser;
  }

  async create(page: Page) {
    return page;
  }

  private async initialize() {
    if (RepositoryPuppeteer._browser) return;
    RepositoryPuppeteer._browser = await puppeteer.launch({
      userDataDir: "out/puppeteer-data",
      headless: true,
      executablePath: "/usr/bin/google-chrome-stable",
      args: [
        "--disable-default-apps",
        "--disable-extensions",
        "--disable-setuid-sandbox",
        "--enable-features=NetworkService",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--no-default-browser-check",
        "--no-experiments",
        "--no-sandbox",
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
    });
  }

  async close() {
    this.browser?.close();
  }

  async printScreenBase64Data(page: Page): Promise<string> {
    if (!this.browser) throw "Browser não iniciado!";
    const pagePuppet = await this.browser.newPage();
    if (page.templateHTML) {
      await pagePuppet.setContent(page.templateHTML);
    } else {
      await pagePuppet.goto(page.url);
    }
    const content = await pagePuppet.$("body");
    if (content) {
      const imageBuffer = await content.screenshot();
      await pagePuppet.close();
      await this.browser.close();
      return `data:image/png;base64,${imageBuffer.toString("base64")}`;
    }
    throw "Página inválida!";
  }
}
