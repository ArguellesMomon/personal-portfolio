import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

// Generate code-native branding assets without a running development server.
const channel =
  process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined);
const browser = await chromium.launch({ channel, headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const font = await readFile(
    new URL(
      '../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
      import.meta.url,
    ),
  );
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Display; src: url(data:font/woff2;base64,${font.toString('base64')}); font-weight: 100 900; }
    * { box-sizing: border-box; } body { margin: 0; background: #fafbf9; color: #1d2923; font-family: Display, sans-serif; }
    main { width: 1200px; height: 630px; padding: 64px 72px; }
    .name { font-size: 27px; font-weight: 600; letter-spacing: -1px; }
    .role { margin-top: 45px; font-size: 15px; letter-spacing: 2px; text-transform: uppercase; color: #56645b; }
    h1 { font-size: 79px; line-height: 1.1; letter-spacing: -4px; font-weight: 600; margin: 20px 0 32px; }
    h1 span { color: #1c5b43; }
    .foot { display: flex; justify-content: space-between; border-top: 1px solid #dce3dd; padding-top: 24px; margin-top: 46px; font-size: 15px; color: #56645b; }
  </style></head><body><main><div class="name">Richmond Arguelles<span style="color:#1c5b43">.</span></div><div class="role">Software developer</div><h1>Web, mobile &amp;<br /><span>embedded systems.</span></h1><div class="foot"><span>Computer Science · De La Salle Lipa</span><span>Philippines</span></div></main></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/og-card.png' });

  const svg = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');
  for (const [size, file] of [
    [512, 'favicon-512.png'],
    [192, 'favicon-192.png'],
    [180, 'apple-touch-icon.png'],
    [32, null],
  ]) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`,
    );
    const png = await page.screenshot({ omitBackground: true });
    if (file) await writeFile(`public/${file}`, png);
    else {
      // ICO permits PNG image data; write its single-image header and directory.
      const header = Buffer.alloc(22);
      header.writeUInt16LE(1, 2);
      header.writeUInt16LE(1, 4);
      header[6] = size;
      header[7] = size;
      header.writeUInt16LE(1, 10);
      header.writeUInt16LE(32, 12);
      header.writeUInt32LE(png.length, 14);
      header.writeUInt32LE(22, 18);
      await writeFile('public/favicon.ico', Buffer.concat([header, png]));
    }
  }
  console.log('Generated social card, SVG-backed PNG favicons, Apple icon, and ICO.');
} finally {
  await browser.close();
}
