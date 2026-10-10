// Visual check: screenshot the Projects section so the blurred
// link-preview backgrounds can be inspected.
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
await page.goto('http://localhost:3000', {
  waitUntil: 'networkidle2',
  timeout: 60000,
});
await page.waitForFunction(() => !!window.lenis?.version, { timeout: 15000 });

// Jump straight to #projects (Reveal animations need a moment).
await page.evaluate(() => {
  document.getElementById('projects').scrollIntoView();
});
await sleep(2000);
await page.screenshot({ path: 'scripts/projects-check.png' });

// Also capture the first card up close.
const card = await page.$('#projects article');
if (card) await card.screenshot({ path: 'scripts/projects-card.png' });
console.log('screenshots saved');
await browser.close();
