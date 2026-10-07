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
      '../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
      import.meta.url,
    ),
  );
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Display; src: url(data:font/woff2;base64,${font.toString('base64')}); font-weight: 300 700; }
    * { box-sizing: border-box; } body { margin: 0; background: #f7f5ee; color: #252d28; font-family: Display, sans-serif; }
    main { padding: 57px 64px; width: 1200px; height: 630px; position: relative; overflow: hidden; }
    .brand { display: flex; align-items: center; gap: 12px; font-size: 23px; font-weight: 600; letter-spacing: -.7px; }
    .mark { display: flex; align-items: center; justify-content: center; width: 43px; height: 43px; background: #252d28; border-radius: 11px; color: #f7f5ee; font-size: 33px; padding-bottom: 4px; }
    .mark span { color: #accb9b; } .brand i { color: #2f624b; font-style: normal; }
    .name { font-size: 16px; margin-top: 43px; letter-spacing: -.4px; }
    h1 { font-size: 74px; line-height: 1.07; letter-spacing: -4.2px; font-weight: 600; margin: 18px 0 28px; }
    h1 span { color: #2f624b; } .role { font-size: 16px; color: #59665d; }
    .foot { position: absolute; bottom: 40px; left: 64px; right: 64px; border-top: 1px solid #dce2d6; padding-top: 19px; color: #59665d; font-size: 12px; display: flex; justify-content: space-between; }
    .seal { position: absolute; right: 78px; top: 125px; width: 340px; height: 340px; border-radius: 50%; border: 1px solid #c6d7bf; display: flex; justify-content: center; align-items: center; transform: rotate(-9deg); }
    .seal::before { content: ''; position: absolute; inset: 22px; border-radius: 50%; border: 1px solid #c6d7bf; background: #e7eee4; }
    .seal strong { position: relative; font-size: 220px; letter-spacing: -33px; padding-right: 25px; line-height: 1; color: #2f624b; font-weight: 600; }
    .seal strong span { color: #252d28; } .spark { position: absolute; right: 57px; top: 114px; color: #2f624b; font-size: 73px; }
    .dot { display: inline-block; width: 7px; height: 7px; background: #659979; border-radius: 50%; margin-right: 7px; }
  </style></head><body><main><div class="brand"><div class="mark">r<span>.</span></div>richmond<i>.</i></div><div class="name">Richmond Arguelles / Software Developer</div><h1>Built to work.<br />Designed to<br /><span>feel right.</span></h1><div class="role">Web · Mobile · Embedded systems · Data & ML</div><div class="seal"><strong>r<span>.</span></strong></div><div class="spark">✳</div><div class="foot"><span><span class="dot"></span>Open to internship opportunities</span><span>Thoughtful software. Useful experiences.</span></div></main></body></html>`);
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
