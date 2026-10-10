// One-off verification script: does the right-side SectionNav land exactly
// on each section — including clicks issued from inside the pinned Story?
import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3000';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800'],
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();
page.on('pageerror', (e) => console.log('PAGE ERROR:', e.message));

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 });

// Wait for hydration: Lenis sets window.lenis.version on init.
await page.waitForFunction(() => !!window.lenis?.version, { timeout: 15000 });
await sleep(500);

// Story pin range, measured from layout (pin spacer for #story).
const layout = await page.evaluate(() => {
  const spacer = document.querySelector('.pin-spacer');
  const story = document.getElementById('story');
  const start = spacer
    ? spacer.getBoundingClientRect().top + window.scrollY
    : story.getBoundingClientRect().top + window.scrollY;
  const end = start + window.innerHeight * 6 * 1.1; // matches SCREENS_PER_SCENE
  return {
    start,
    end,
    docHeight: document.documentElement.scrollHeight,
    vh: window.innerHeight,
  };
});
console.log('pin range:', layout);

const results = [];
async function clickNav(label, fromY, name) {
  // Go to the "from" position first (idle Lenis will absorb native scroll).
  await page.evaluate((y) => window.scrollTo(0, y), fromY);
  await sleep(400);
  const before = await page.evaluate(() => ({
    y: window.scrollY,
    pinned: !!document.querySelector(
      '#story[style*="position: fixed"], #story[data-pin-fixed]'
    ),
    storyPos: getComputedStyle(document.getElementById('story')).position,
  }));

  // Click the nav button whose label span matches.
  const clicked = await page.evaluate((label) => {
    const btns = [...document.querySelectorAll('nav[aria-label] button')];
    const btn = btns.find(
      (b) => b.textContent.trim().toLowerCase() === label.toLowerCase()
    );
    if (!btn) return false;
    btn.click();
    return true;
  }, label);
  if (!clicked) {
    results.push({ name, error: 'button not found' });
    return;
  }

  await sleep(2200); // 1.4s Lenis animation + buffer
  const after = await page.evaluate((label) => {
    const el = document.getElementById(label);
    const r = el ? el.getBoundingClientRect().top : null;
    return {
      y: window.scrollY,
      targetTop: r,
      storyPos: getComputedStyle(document.getElementById('story')).position,
    };
  }, label.toLowerCase());
  results.push({ name, before, after, ok: Math.abs(after.targetTop) < 8 });
}

// 1. About from MID-story (the reported failure).
await clickNav('About', layout.start + (layout.end - layout.start) / 2, 'About from mid-story');
// 2. Projects from mid-story.
await clickNav('Projects', layout.start + (layout.end - layout.start) / 3, 'Projects from mid-story');
// 3. Story from Contact (bottom) — the previous round's fix.
await clickNav('Story', layout.docHeight, 'Story from bottom');
// 4. Contact from hero (top).
await clickNav('Contact', 0, 'Contact from top');
// 5. Back to About from top again (loop check).
await clickNav('About', 0, 'About from top');

console.log(JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.ok);
console.log(failed.length === 0 ? 'ALL NAV TESTS PASSED' : `FAILED: ${failed.length}`);
await browser.close();
process.exit(failed.length === 0 ? 0 : 1);
