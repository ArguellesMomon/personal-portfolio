import { test, expect } from '@playwright/test';

test('ambient scene has depth, interactive cards retain their controls, and motion can be paused', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
  await expect(page.getByRole('button', { name: 'Pause animations' })).toBeEnabled();
  expect(
    await page.locator('.ambient-moss').evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('light-drift');
  await expect(page.locator('.site-atmosphere')).toHaveAttribute('aria-hidden', 'true');
  expect(
    await page.locator('.site-atmosphere').evaluate((node) => getComputedStyle(node).pointerEvents),
  ).toBe('none');
  const card = page.locator('.work-card').first();
  await card.scrollIntoViewIfNeeded();
  const bounds = await card.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * 0.8, bounds.y + bounds.height * 0.3);
  await expect(card).toHaveAttribute('data-pointer', 'active');
  await expect
    .poll(() => card.evaluate((node) => getComputedStyle(node).transform))
    .not.toBe('none');
  const beforeScroll = await card.evaluate((node) =>
    parseFloat(node.style.getPropertyValue('--shine-y')),
  );
  await page.evaluate(() => scrollBy({ top: 32, behavior: 'instant' }));
  await expect
    .poll(() => card.evaluate((node) => parseFloat(node.style.getPropertyValue('--shine-y'))))
    .toBeGreaterThan(beforeScroll);
  await expect(card).toHaveAttribute('data-pointer', 'active');
  await page.getByRole('button', { name: 'Quick view AedesCapella', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  expect(
    await page.locator('.ambient-moss').evaluate((node) => getComputedStyle(node).animationName),
  ).toBe('none');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume animations' })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const rectangle = await page.locator('.hero-visual').boundingBox();
  await page.mouse.move(rectangle.x + rectangle.width * 0.7, rectangle.y + rectangle.height * 0.3);
  await expect(page.locator('.hero-visual')).not.toHaveAttribute('data-pointer', 'active');
  await page.getByRole('button', { name: 'Resume animations' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'full');
});

test('system reduced motion remains still and continuous hero motion pauses outside the viewport', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-visibility', 'visible');
  expect(
    await page.locator('.note-code').evaluate((node) => getComputedStyle(node).animationPlayState),
  ).toBe('running');
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(page.locator('.hero-visual')).toHaveAttribute('data-scene-visibility', 'hidden');
  expect(
    await page.locator('.note-code').evaluate((node) => getComputedStyle(node).animationPlayState),
  ).toBe('paused');
  await expect
    .poll(() =>
      page.evaluate(() =>
        Number(document.documentElement.style.getPropertyValue('--reading-progress')),
      ),
    )
    .toBeGreaterThan(0.9);
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await page.getByRole('button', { name: 'Back to top' }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.getByRole('button', { name: 'Resume animations' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(
    page.getByRole('button', { name: 'Animations reduced by your system settings' }),
  ).toBeDisabled();
  const names = await page
    .locator('.site-atmosphere .ambient-light, .terrain-contours, .note-code, .note-degree')
    .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).animationName));
  expect(names.every((name) => name === 'none')).toBe(true);
  expect(
    await page
      .locator('.hero-line-text')
      .first()
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe('none');
});

test('touch visitors get a responsive scene and can pause it without losing navigation', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: 'http://127.0.0.1:5173',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  await page.goto('/');
  expect(
    await page.locator('.atmosphere-pointer').evaluate((node) => getComputedStyle(node).display),
  ).toBe('none');
  await page.getByRole('button', { name: 'Pause animations' }).tap();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('button', { name: 'Open navigation' }).tap();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Projects', exact: true })
    .tap();
  await expect(page).toHaveURL('/projects');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});
