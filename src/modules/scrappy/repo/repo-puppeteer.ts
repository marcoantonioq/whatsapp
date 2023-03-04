import puppeteer from "puppeteer";
import { InterfaceRepository, Page } from "../core/Page";

export class RepositoryPuppeteer implements InterfaceRepository {
  constructor(public readonly data: Page[]) {}

  async pages() {
    return this.data;
  }

  async create(page: Page) {
    return page;
  }

  async printScreen(page: Page): Promise<string | Buffer> {
    const browser = await puppeteer.launch({
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
    const pagePuppet = await browser.newPage();
    if (page.templateHTML) {
      await pagePuppet.setContent(page.templateHTML);
    } else {
      await pagePuppet.goto(page.url);
    }
    const content = await pagePuppet.$("body");
    if (content) {
      const imageBuffer = await content.screenshot();
      await pagePuppet.close();
      await browser.close();
      return imageBuffer;
    }
    throw "Página inválida!";
  }
}
