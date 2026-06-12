// scripts/render-template.js
// Render the surat-pengantar HTML template via headless Chromium to PDF + PNG.
// Usage: node scripts/render-template.js [sample-data.json]

const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function main() {
  const dataPath = process.argv[2] || path.join(__dirname, "..", "scripts", "sample-surat.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(raw);

  const outDir = path.join(__dirname, "..", "scripts", "out");
  fs.mkdirSync(outDir, { recursive: true });

  console.log("[render] Rendering template to HTML...");
  require("tsx/cjs");
  const mod = require("../src/templates/surat-pengantar-html.tsx");
  const html =
    "<!doctype html><html><head><meta charset='utf-8'>" +
    "<style>body{font-family:'Times New Roman',serif;margin:0;}</style></head><body>" +
    mod.renderSuratPengantarHTML(data) +
    "</body></html>";

  const htmlFile = path.join(outDir, "preview.html");
  fs.writeFileSync(htmlFile, html);
  console.log("[render] HTML written to", htmlFile);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 794, height: 1123 } });
  const page = await context.newPage();
  await page.goto("file:///" + htmlFile.replace(/\\/g, "/"));
  await page.waitForTimeout(500);

  const pdfPath = path.join(outDir, "preview.pdf");
  await page.pdf({ path: pdfPath, format: "A4", printBackground: true });
  console.log("[render] PDF written to", pdfPath);

  const pngPath = path.join(outDir, "preview.png");
  await page.screenshot({ path: pngPath, fullPage: true });
  console.log("[render] PNG written to", pngPath);

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
