import puppeteer, { Browser } from "puppeteer";

let browser: Browser | null = null;

export async function getBrowser() {
  console.log("Browser requested!")
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("Browser created!")
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    console.log("Browser closed!")
    browser = null;
  }
}