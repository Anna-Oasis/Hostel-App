import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { getBrowser } from "./puppeteer";

function resolveTemplateDir(): string {
  const currentDir = typeof __dirname === "string" ? __dirname : process.cwd();
  const candidates = [
    path.resolve(currentDir, "../pdf-templates/html-template"),
    path.resolve(process.cwd(), "pdf-templates/html-template"),
    path.resolve(process.cwd(), "Server/pdf-templates/html-template"),
  ];

  const templateDir = candidates.find((candidate) => fs.existsSync(candidate));

  if (!templateDir) {
    throw new Error("HTML template directory not found.");
  }

  return templateDir;
}

export async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await getBrowser()
  const page = await browser.newPage();
  try {
    const templateDir = resolveTemplateDir();
    const logoPath = path.resolve(templateDir, "anna_logo.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const htmlWithBasePath = html.replace(
      "<head>",
      `<head><base href="file://${templateDir}/">`
    ).replace(
      /src=["']\.\/anna_logo\.png["']/g,
      `src="data:image/png;base64,${logoBase64}"`
    );

    await page.setContent(htmlWithBasePath, { waitUntil: "load" });
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      preferCSSPageSize: true,
      printBackground: true,
    });

    return Buffer.from(pdf);
  } finally {
    await page.close();
  }
}
