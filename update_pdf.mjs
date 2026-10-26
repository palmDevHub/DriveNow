import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('pdf_artifacts');
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');
const FINAL_PDF_PATH = path.resolve('DriveNow_App_Screenshots.pdf');

function getBase64Image(filename) {
  const filePath = path.join(SCREENSHOTS_DIR, filename);
  if (fs.existsSync(filePath)) {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  }
  return '';
}

async function renderPdf() {
  console.log('🎨 Rebuilding HTML with updated 06_checkout_step3.png...');

  // Use the same HTML generation from generate_pdf.mjs
  // Read generate_pdf.mjs and extract generatePresentationHtml
  const scriptContent = fs.readFileSync('generate_pdf.mjs', 'utf-8');
  const startIdx = scriptContent.indexOf('function generatePresentationHtml()');
  const endIdx = scriptContent.indexOf('async function renderPdfFromHtml(');
  const fnCode = scriptContent.substring(startIdx, endIdx);
  
  // Execute function
  const genHtml = new Function('getBase64Image', 'path', 'fs', 'OUTPUT_DIR', `
    ${fnCode}
    return generatePresentationHtml();
  `);
  
  const htmlPath = genHtml(getBase64Image, path, fs, OUTPUT_DIR);

  console.log('📄 Rendering PDF via Chrome headless...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  await page.pdf({
    path: FINAL_PDF_PATH,
    format: 'A4',
    landscape: true,
    printBackground: true,
    preferCSSPageSize: true
  });

  await browser.close();
  const stats = fs.statSync(FINAL_PDF_PATH);
  console.log('🎉 DriveNow_App_Screenshots.pdf updated successfully!');
  console.log(`📦 Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

renderPdf().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
