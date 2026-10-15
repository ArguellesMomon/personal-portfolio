import { test, expect } from '@playwright/test';

test('phone projects stay compact with native scrolling and return to the homepage', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const track = page.getByRole('region', { name: 'Featured projects', exact: true });
  await track.scrollIntoViewIfNeeded();
  const cards = track.locator('.work-card');
  await expect(page.getByText('Swipe to explore', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /featured project/ })).toHaveCount(0);
  await expect(cards.first().locator('.work-card-body > p')).toBeHidden();
  await expect(cards.first()).toBeInViewport();
  expect((await cards.first().boundingBox()).height).toBeLessThan(400);
  expect(await track.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await track.focus();
  for (let index = 1; index < 3; index++) {
    await page.keyboard.press('ArrowRight');
    await expect(cards.nth(index)).toBeInViewport({ ratio: 0.95 });
  }
  await page.keyboard.press('ArrowLeft');
  await expect(cards.nth(1)).toBeInViewport({ ratio: 0.95 });
  const link = cards.nth(1).getByRole('link', { name: 'View project', exact: true });
  const href = await link.getAttribute('href');
  await link.click();
  await expect(page).toHaveURL(href);
  await expect(page.locator('.project-heading > p')).toBeVisible();
  await page.reload();
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL('/#home-projects');
  await expect(page.getByRole('heading', { name: 'Built from the ground up.' })).toBeInViewport();
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
  await page.locator('#home-certificates').scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'The work behind the work.' })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test('keyboard navigation, phone widths, and desktop grid remain accessible', async ({ page }) => {
  for (const width of [320, 393, 560]) {
    await page.setViewportSize({ width, height: 900 });
    for (const colorScheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme });
      await page.goto('/');
      const track = page.locator('#featured-projects');
      await track.focus();
      const cards = track.locator('.work-card');
      const expectCentered = async (index) => {
        await expect
          .poll(() =>
            cards.nth(index).evaluate((el) => {
              const box = el.getBoundingClientRect();
              return Math.abs(box.left + box.width / 2 - innerWidth / 2);
            }),
          )
          .toBeLessThan(1);
      };
      await expectCentered(0);
      for (const index of [1, 2]) {
        await page.keyboard.press('ArrowRight');
        await expectCentered(index);
        await expect(cards.nth(index)).toBeInViewport({ ratio: 0.95 });
      }
      // A swipe to the very end must still leave the final card centered.
      await track.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: 'instant' }));
      await expectCentered(2);
      await page.keyboard.press('ArrowLeft');
      await expectCentered(1);
      await page.keyboard.press('ArrowLeft');
      await expectCentered(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('#featured-projects')).toHaveCSS('display', 'grid');
  await expect(page.locator('#featured-projects')).not.toHaveAttribute('tabindex');
  await expect(page.locator('#featured-projects .work-card-body > p').first()).toBeVisible();
});

test('all homepage project links and next-project links preserve the return path', async ({
  page,
}) => {
  await page.goto('/');
  for (const selector of ['.work-card-media', 'h3 a', '.card-actions a:first-child']) {
    await page.locator('#featured-projects .work-card').first().locator(selector).click();
    await expect(page.getByRole('link', { name: 'Back to home', exact: true })).toHaveAttribute(
      'href',
      '/#home-projects',
    );
    await page.getByRole('link', { name: 'Back to home', exact: true }).click();
    await expect(page).toHaveURL('/#home-projects');
  }
  await page.locator('#featured-projects .work-card h3 a').first().click();
  const firstProject = page.url();
  const firstTitle = await page.locator('h1').textContent();
  await page.locator('.next-project').click();
  await page.getByRole('link', { name: `Back to ${firstTitle}`, exact: true }).click();
  await expect(page).toHaveURL(firstProject);
  await page.getByRole('link', { name: 'Back to home', exact: true }).click();
  await expect(page).toHaveURL('/#home-projects');
  await page.goto('/projects/wellbot');
  await expect(page.getByRole('link', { name: 'Back to projects', exact: true })).toHaveAttribute(
    'href',
    '/projects',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects?q=Pocket');
  await expect(page.locator('.work-card-body > p')).toBeVisible();
});
