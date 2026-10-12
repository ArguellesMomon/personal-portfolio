import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('project library filters, search, sorting, URL state, and empty recovery', async ({
  page,
}) => {
  await page.goto('/projects');
  await expect(page.locator('.work-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Mobile apps' }).click();
  await expect(page.locator('.work-card')).toHaveCount(2);
  await expect(page).toHaveURL(/category=Mobile/);
  await page.reload();
  await expect(page.locator('.work-card')).toHaveCount(2);
  await page.getByRole('button', { name: 'All projects' }).click();
  await page.getByRole('searchbox').fill('Chami');
  await expect(page.locator('.work-card')).toHaveCount(1);
  await expect(page.locator('.work-card h2')).toHaveText('MedTech Mate');
  await page.getByRole('searchbox').fill('no-such-project');
  await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('.work-card')).toHaveCount(12);
  await page.getByRole('combobox', { name: 'Sort projects' }).selectOption('name');
  await expect(page.locator('.work-card h2').first()).toHaveText('AedesCapella');
  await expect(page.locator('.work-card h2').last()).toHaveText('Travel Diary App');
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.locator('.project-results')).toHaveClass(/list-view/);
  await page.getByRole('button', { name: 'Grid view', exact: true }).click();
  await expect(page.locator('.project-results')).not.toHaveClass(/list-view/);
  await page.getByRole('button', { name: 'Mobile apps' }).click();
  await page.getByRole('heading', { name: 'Eventure', exact: true }).getByRole('link').click();
  await page.getByRole('link', { name: 'Project collection' }).click();
  await expect(page).toHaveURL(/category=Mobile/);
  await expect(page.locator('.work-card')).toHaveCount(2);
});

test('quick view traps focus, closes with Escape, restores focus, and opens details', async ({
  page,
}) => {
  await page.goto('/projects');
  const opener = page.getByRole('button', { name: 'Quick view AedesCapella', exact: true });
  await opener.focus();
  await opener.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close project preview' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(dialog.getByRole('link', { name: 'Explore the project' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close project preview' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  await opener.click();
  await dialog.getByRole('link', { name: 'Explore the project' }).click();
  await expect(page).toHaveURL('/projects/aedescapella');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('AedesCapella');
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await expect(page).toHaveTitle('AedesCapella — Richmond Arguelles');
});

test('themes persist, follow system settings, and respect reduced motion', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('combobox', { name: 'Theme preference' }).selectOption('system');
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  const duration = await page
    .locator('.hero-copy')
    .evaluate((element) => getComputedStyle(element).animationDuration);
  expect(parseFloat(duration)).toBeLessThan(0.01);
});

test('mobile navigation, active links, route focus, contact links, and 404 recovery', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).not.toBeVisible();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL('/about');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: /arguellesrichmond@gmail.com/ })).toHaveAttribute(
    'href',
    'mailto:arguellesrichmond@gmail.com',
  );
  await expect(
    page.locator('main a[href="https://www.linkedin.com/in/richmond-arguelles-71708a430"]'),
  ).toHaveCount(1);
  await expect(page.getByRole('link', { name: /résumé/i })).toHaveCount(0);
  await page.goto('/projects/invalid');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('off the beaten path');
  await page.getByRole('link', { name: 'Back home', exact: true }).click();
  await expect(page).toHaveURL('/');
});

test('share action copies a direct project URL', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/projects/wellbot');
  await page.getByRole('button', { name: 'Share project' }).click();
  await expect(page.getByRole('status')).toHaveText('Link copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'http://127.0.0.1:5173/projects/wellbot',
  );
});

for (const theme of ['light', 'dark']) {
  test(`accessibility on all primary pages and dialog in ${theme} mode`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('portfolio-theme', value), theme);
    for (const route of [
      '/',
      '/projects',
      '/about',
      '/contact',
      '/achievements',
      '/projects/aedescapella',
      '/missing',
    ]) {
      await page.goto(route);
      await page.locator('main h1').waitFor();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        results.violations,
        `${route}: ${JSON.stringify(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })))}`,
      ).toEqual([]);
    }
    await page.goto('/projects');
    await page.getByRole('button', { name: 'Quick view AedesCapella', exact: true }).focus();
    await page.getByRole('button', { name: 'Quick view AedesCapella', exact: true }).click();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('responsive pages have no horizontal overflow or runtime errors', async ({
  page,
}, testInfo) => {
  test.setTimeout(90000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/',
      '/projects',
      '/about',
      '/contact',
      '/achievements',
      '/projects/aedescapella',
      '/projects/wellbot',
      '/projects/eventure',
      '/projects/king-ace-trading',
      '/projects/pickletayo',
      '/projects/photobooth',
      '/projects/pinoy-recipe-finder',
      '/projects/study-spot-ph',
      '/projects/c4a-dashboard',
      '/projects/daymargin',
      '/projects/travel-diary',
    ]) {
      await page.goto(route);
      await expect(page.locator('main h1')).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        viewport: innerWidth,
        page: document.documentElement.scrollWidth,
      }));
      expect(dimensions.page, `${route} overflows at ${width}px`).toBeLessThanOrEqual(
        dimensions.viewport,
      );
      if (route === '/' && [390, 1440].includes(width))
        await page.screenshot({
          path: testInfo.outputPath(`home-light-${width}.png`),
          fullPage: true,
        });
      if (
        [390, 1440].includes(width) &&
        ['/about', '/contact', '/projects/aedescapella'].includes(route)
      ) {
        await page.screenshot({
          path: testInfo.outputPath(`${route.replaceAll('/', '-')}-${width}.png`),
          fullPage: true,
        });
      }
    }
  }
  expect(errors).toEqual([]);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.screenshot({ path: testInfo.outputPath('home-dark-1440.png'), fullPage: true });
  await page.goto('/projects');
  await page.screenshot({ path: testInfo.outputPath('projects-dark-1440.png'), fullPage: true });
  await page.goto('/contact');
  await page.screenshot({ path: testInfo.outputPath('contact-dark-1440.png'), fullPage: true });
});

test('mobile accessibility and menu work in both themes', async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const theme of ['light', 'dark']) {
    await page.addInitScript((value) => localStorage.setItem('portfolio-theme', value), theme);
    for (const route of ['/', '/projects', '/about', '/contact']) {
      await page.goto(route);
      await page.locator('main h1').waitFor();
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(
        results.violations.map(({ id, nodes }) => ({
          id,
          targets: nodes.map((node) => node.target),
        })),
        `${theme} ${route}`,
      ).toEqual([]);
    }
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const menuResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      menuResults.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.map((node) => node.target),
      })),
    ).toEqual([]);
  }
});
