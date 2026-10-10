// Opens each project's LIVE site and captures its front page — these
// become the (blurred) card backgrounds in the Projects section.
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG = execFileSync('node', ['-p', "require('ffmpeg-static')"])
  .toString()
  .trim();

const SITES = [
  { slug: 'tickchen', url: 'https://tickchen-web-backend.vercel.app' },
  { slug: 'rag', url: 'https://speckitplus-hackhathon.vercel.app' },
  { slug: 'petrol', url: 'https://petrol-subsidy-demo-app.vercel.app' },
  { slug: 'jewellery', url: 'https://jewellery-website-gamma-swart.vercel.app' },
  { slug: 'docker-portfolio', url: 'https://react-with-docker.vercel.app' },
  { slug: 'final-hackathon', url: 'https://final-hackathon-smit-two.vercel.app' },
  { slug: 'enquiry-form', url: 'https://mern-enquiry-form.vercel.app' },
  { slug: 'flashcards', url: 'https://flashcard-app-lemon.vercel.app' },
  { slug: 'shopco', url: 'https://shop-co-three-orcin.vercel.app' },
  { slug: 'weather', url: 'https://wheather-app-lime.vercel.app' },
];

mkdirSync('scripts/shots', { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: { width: 1280, height: 800 },
});

const results = [];
for (const { slug, url } of SITES) {
  const page = await browser.newPage();
  try {
    const resp = await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 45000,
    });
    await sleep(1800); // let client animations/hero images settle
    const png = `scripts/shots/${slug}.png`;
    await page.screenshot({ path: png });
    const jpg = `public/posters/site-${slug}.jpg`;
    execFileSync(FFMPEG, [
      '-y', '-hide_banner', '-loglevel', 'error',
      '-i', png, '-vf', 'scale=1280:-2', '-q:v', '4', jpg,
    ]);
    results.push({ slug, status: resp?.status(), title: await page.title() });
  } catch (e) {
    results.push({ slug, error: String(e).slice(0, 120) });
  }
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
