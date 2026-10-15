import { test, expect } from '@playwright/test';

test('phone projects scroll horizontally with working buttons and project links', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const track = page.getByRole('region', { name: 'Featured projects', exact: true });
  await track.scrollIntoViewIfNeeded();
  const cards = track.locator('.work-card');
  const previous = page.getByRole('button', { name: 'Previous featured project' });
  const next = page.getByRole('button', { name: 'Next featured project' });
  await expect(previous).toBeDisabled();
  await expect(cards.first()).toBeInViewport();
  expect((await cards.first().boundingBox()).height).toBeLessThan(500);
  expect(await track.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  for (let index = 1; index < 3; index++) {
    await next.click();
    await expect(page.locator('.featured-project-position')).toHaveText(`${index + 1} of 3`);
    await expect(cards.nth(index)).toBeInViewport({ ratio: 0.95 });
  }
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(page.locator('.featured-project-position')).toHaveText('2 of 3');
  const link = cards.nth(1).getByRole('link', { name: 'View project', exact: true });
  const href = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(href);
});

test('swiping moves the native row while vertical page scrolling remains available', async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL,
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('/');
  const track = page.locator('#featured-projects');
  await track.scrollIntoViewIfNeeded();
  const box = await track.boundingBox();
  const session = await context.newCDPSession(page);
  const y = Math.max(150, box.y + 100);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: 325, y }],
  });
  for (let x = 300; x >= 70; x -= 25) {
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
  await expect(page.locator('.featured-project-position')).not.toHaveText('1 of 3');
  await page.locator('#home-certificates').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'The work behind the work.' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('keyboard navigation, phone widths, and desktop grid remain accessible', async ({ page }) => {
  for (const width of [320, 390, 560]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const track = page.locator('#featured-projects');
    await track.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('.featured-project-position')).toHaveText('2 of 3');
    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('.featured-project-position')).toHaveText('1 of 3');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('.featured-project-controls')).toBeHidden();
  await expect(page.locator('#featured-projects')).toHaveCSS('display', 'grid');
  await expect(page.locator('#featured-projects')).not.toHaveAttribute('tabindex');
});
