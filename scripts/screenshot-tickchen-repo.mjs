// The Tickchen live site currently returns HTTP 500 on Vercel, so its
// card image comes from the GitHub repo page instead.
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG = execFileSync('node', ['-p', "require('ffmpeg-static')"])
  .toString()
  .trim();

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
const resp = await page.goto(
  'https://github.com/MuhammadHamza524727/Tickchen_Web_Backend',
  { waitUntil: 'networkidle2', timeout: 60000 }
);
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: 'scripts/shots/tickchen.png' });
execFileSync(FFMPEG, [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-i', 'scripts/shots/tickchen.png',
  '-vf', 'scale=1280:-2', '-q:v', '4',
  'public/posters/site-tickchen.jpg',
]);
console.log('repo page status:', resp?.status());
await browser.close();
