import fs from "fs";
import path from "path";

export interface HtmlTemplateData {
  [key: string]: string | number | boolean | null | undefined;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function inlineTemplateAssets(html: string, templateDir: string): string {
  const logoPath = path.resolve(templateDir, "anna_logo.png");

  if (!fs.existsSync(logoPath)) {
    return html;
  }

  const logoBase64 = fs.readFileSync(logoPath).toString("base64");

  return html.replace(
    /src=["']\.\/anna_logo\.png["']/g,
    `src="data:image/png;base64,${logoBase64}"`
  );
}

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

export function fillHtmlTemplate(
  templateName: string,
  data: HtmlTemplateData
): string {
  const templateDir = resolveTemplateDir();
  const templatePath = path.resolve(
    templateDir,
    `${templateName}.html`
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error(`HTML template "${templateName}.html" not found.`);
  }

  let html = fs.readFileSync(templatePath, "utf-8");

  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
    html = html.replace(placeholder, escapeHtml(String(value ?? "")));
  });

  return inlineTemplateAssets(
    html.replace(/{{\s*[\w.]+\s*}}/g, ""),
    templateDir
  );
}
