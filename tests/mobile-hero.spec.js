import { test, expect } from '@playwright/test';

for (const colorScheme of ['light', 'dark']) {
  test(`touch portrait keeps its photo and labels above the decorations in ${colorScheme}`, async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({
      baseURL: testInfo.project.use.baseURL,
      viewport: { width: 393, height: 852 },
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'no-preference',
      colorScheme,
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/');
    for (const viewport of [
      { width: 320, height: 740 },
      { width: 393, height: 852 },
      { width: 430, height: 932 },
      { width: 852, height: 393 },
    ]) {
      await page.setViewportSize(viewport);
      const visual = page.locator('.home-hero-visual');
      await visual.scrollIntoViewIfNeeded();
      await expect(visual).toHaveCSS('perspective', 'none');
      await expect(page.locator('.home-depth-stage')).toHaveCSS('transform-style', 'flat');
      await expect(page.locator('.hero-portrait')).toHaveCSS('opacity', '1');
      const image = page.locator('.hero-portrait img');
      await expect
        .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
        .toBe(true);
      await expect
        .poll(() =>
          image.evaluate((el) => {
            const box = el.getBoundingClientRect();
            return (
              document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2) === el
            );
          }),
        )
        .toBe(true);
      for (const label of await page.locator('.home-skill-note').all()) {
        await label.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            label.evaluate((el) => {
              const box = el.getBoundingClientRect();
              return (
                document
                  .elementFromPoint(box.left + box.width / 2, box.top + box.height / 2)
                  ?.closest('.home-skill-note') === el
              );
            }),
          )
          .toBe(true);
      }
      await expect(page.getByRole('button', { name: /pause|resume|reduced motion/i })).toHaveCount(
        0,
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      if (viewport.width === 393) {
        await visual.screenshot({
          path: testInfo.outputPath(`portrait-${colorScheme}.png`),
          animations: 'disabled',
        });
      }
    }
    expect(errors).toEqual([]);
    await context.close();
  });
}
