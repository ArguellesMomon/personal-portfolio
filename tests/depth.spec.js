import { test, expect } from '@playwright/test';

async function tilt(page, surface) {
  await surface.scrollIntoViewIfNeeded();
  // Flush the scroll event before moving the pointer: scrolling intentionally resets tilt.
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  const box = await surface.boundingBox();
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.3);
  await expect(surface).toHaveAttribute('data-depth-active', 'true');
}

test('portrait and project cards respond to the pointer and keep navigation usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const portrait = page.locator('[data-depth="portrait"]');
  await tilt(page, portrait);
  await expect(page.locator('.home-depth-stage')).toHaveCSS('transform', /matrix3d/);
  await expect(page.locator('.home-note-device')).toHaveCSS('translate', '0px 0px 112px');
  await page.mouse.move(10, 150);
  await expect(portrait).not.toHaveAttribute('data-depth-active');

  await page.goto('/projects');
  const card = page.locator('.work-card-depth').first();
  await tilt(page, card);
  await expect(card.locator('.work-card')).toHaveCSS('transform', /matrix3d/);
  const link = card.getByRole('link', { name: /view project/i });
  const destination = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(destination);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('keyboard focus settles a tilted card and its links still open', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const card = page.locator('.work-card-depth').first();
  await tilt(page, card);
  await page.keyboard.press('Tab');
  const link = card.getByRole('link', { name: /view project/i });
  await link.focus();
  await expect(link).toBeFocused();
  await expect(card).not.toHaveAttribute('data-depth-active');
  await page.mouse.move(500, 200);
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5);
  await expect(card).not.toHaveAttribute('data-depth-active');
  const destination = await link.getAttribute('href');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(destination);
});

test('site-wide motion preference persists across routes and system changes stop tilt', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  const card = page.locator('.work-card-depth').first();
  await tilt(page, card);
  await page.getByRole('button', { name: 'Pause visual effects' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await expect(card).not.toHaveAttribute('data-depth-active');
  await page.getByRole('link', { name: 'Home', exact: true }).first().click();
  await expect(page.getByRole('button', { name: 'Resume homepage animations' })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced');
  await page.getByRole('button', { name: 'Resume homepage animations' }).click();
  await tilt(page, page.locator('[data-depth="portrait"]'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('[data-depth-active]')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Animations reduced by system settings' }),
  ).toBeDisabled();
  await expect(page.locator('.home-depth-cube')).toHaveCSS('animation-name', 'none');
});

test('touch layouts stay flat and certificate links remain directly accessible', async ({
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
  const certificate = page.locator('.home-certificate').first();
  await certificate.scrollIntoViewIfNeeded();
  await certificate.dispatchEvent('pointermove', {
    pointerType: 'touch',
    clientX: 200,
    clientY: 400,
  });
  await expect(page.locator('[data-depth-active]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const popupPromise = page.waitForEvent('popup');
  await certificate.tap();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/\.pdf$/i);
  await context.close();
});
