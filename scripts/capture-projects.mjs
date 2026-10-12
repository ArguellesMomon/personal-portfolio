import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

// Capture public project interfaces; this does not sign in or request device permissions.
const targets = [
  { id: 'daymargin', url: 'https://daymargin.vercel.app' },
  { id: 'pickletayo', url: 'https://pickletayo.vercel.app' },
  { id: 'pinoy-recipe-finder', url: 'https://pinoy-recipe-finder-blue.vercel.app' },
  { id: 'study-spot-ph', url: 'https://midterm-project-eta-sable.vercel.app' },
  { id: 'c4a-dashboard', url: 'https://c4a-dashboard.vercel.app' },
  { id: 'photobooth', url: 'https://photo-booth-two-iota.vercel.app' },
  { id: 'wellbot', url: 'https://futurermt.vercel.app' },
];
await mkdir('public/projects', { recursive: true });
await mkdir('.cache/project-review', { recursive: true });
const channel =
  process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined);
const browser = await chromium.launch({ channel, headless: true });
const results = [];
try {
  for (const target of targets.filter(
    (item) => !process.env.CAPTURE_PROJECT || item.id === process.env.CAPTURE_PROJECT,
  )) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      colorScheme: 'light',
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    try {
      const response = await page.goto(target.url, {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      await page.locator('body').waitFor();
      await page.waitForFunction(() => document.body.innerText.trim().length > 40, null, {
        timeout: 10000,
      });
      await page.evaluate(async () => {
        await Promise.race([
          Promise.all([
            document.fonts.ready,
            ...Array.from(document.images).map((image) => image.decode().catch(() => {})),
          ]),
          new Promise((resolve) => setTimeout(resolve, 8000)),
        ]);
      });
      // Let delayed entrance animations finish before taking the actual interface.
      await page.waitForTimeout(3500);
      if (target.id === 'c4a-dashboard') await page.waitForTimeout(15000);
      const text = await page.locator('body').innerText();
      await page.screenshot({
        path: `public/projects/${target.id}.jpg`,
        type: 'jpeg',
        quality: 90,
      });
      results.push({
        ...target,
        status: response?.status(),
        finalUrl: page.url(),
        title: await page.title(),
        text: text.slice(0, 8500),
      });
      console.log(`Captured ${target.id}: ${response?.status()} ${await page.title()}`);
    } catch (error) {
      results.push({ ...target, error: error.message });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
await writeFile('.cache/project-review/deployments.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
