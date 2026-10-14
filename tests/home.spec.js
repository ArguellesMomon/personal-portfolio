import { test, expect } from '@playwright/test';

test('homepage connects background, projects, credentials, and contact with real evidence', async ({
  page,
  request,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Useful apps.Intelligent systems.',
  );
  await expect(page.locator('#home-about')).toContainText('acoustic mosquito detection thesis');
  await expect(page.getByRole('link', { name: 'More about me' })).toHaveAttribute('href', '/about');
  await expect(page.locator('.selected-work .work-card')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'All 18 learning records' })).toHaveAttribute(
    'href',
    '/achievements',
  );
  const highlights = page.locator('.home-certificate');
  await expect(highlights).toHaveCount(2);
  for (const highlight of await highlights.all()) {
    await expect
      .poll(() =>
        highlight.locator('img').evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
    const original = await request.get(await highlight.getAttribute('href'));
    expect(original.ok()).toBe(true);
    expect(original.headers()['content-type']).toContain('application/pdf');
  }
  await expect(page.getByRole('link', { name: 'Start a conversation' })).toHaveAttribute(
    'href',
    '/contact',
  );
  await page.getByRole('link', { name: 'Get to know my work' }).click();
  await expect(page).toHaveURL(/#home-about$/);
  expect((await page.locator('#home-about').boundingBox()).y).toBeGreaterThan(75);
});

test('homepage motion can pause, persist, and follow system reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const home = page.locator('main');
  const orb = page.locator('.home-ambient-orb');
  await expect(home).toHaveAttribute('data-home-motion', 'on');
  await expect(orb).toHaveCSS('animation-name', 'home-light-drift');
  await page.getByRole('button', { name: 'Pause homepage animations' }).click();
  await expect(home).toHaveAttribute('data-home-motion', 'off');
  await expect(orb).toHaveCSS('animation-name', 'none');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Resume homepage animations' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume homepage animations' }).click();
  await page.locator('#home-contact').scrollIntoViewIfNeeded();
  await expect(home).toHaveAttribute('data-hero-visible', 'false');
  await expect(orb).toHaveCSS('animation-play-state', 'paused');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(home).toHaveAttribute('data-home-motion', 'off');
  await page.locator('.hero-section').scrollIntoViewIfNeeded();
  await expect(
    page.getByRole('button', { name: 'Animations reduced by system settings' }),
  ).toBeDisabled();
  await expect(orb).toHaveCSS('animation-name', 'none');
});

test('homepage sections remain available on touch screens with motion enabled', async ({
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
  await page.getByRole('button', { name: 'Pause homepage animations' }).tap();
  for (const id of ['home-about', 'home-projects', 'home-certificates', 'home-contact']) {
    const section = page.locator('#' + id);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.getByRole('link', { name: 'Start a conversation' }).tap();
  await expect(page).toHaveURL('/contact');
  await context.close();
});
