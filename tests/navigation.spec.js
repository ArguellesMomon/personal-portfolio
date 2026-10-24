import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const allProjects = JSON.parse(
  readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'),
);

for (const width of [320, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`back controls follow the mobile layout on every route at ${width}px in ${theme}`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(90000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      const routes = [
        '/',
        '/projects',
        '/about',
        '/contact',
        '/achievements',
        ...allProjects.map((project) => `/projects/${project.id}`),
        '/missing',
        '/projects/invalid',
        '/projects/wellbot/extra',
      ];
      for (const route of routes) {
        await page.goto(route);
        await expect(page.locator('main h1')).toBeVisible();
        const backControls = page
          .getByRole('button', { name: /^Back / })
          .or(page.getByRole('link', { name: /^Back / }));
        const expectedCount = route === '/' || width > 760 ? 0 : 1;
        await expect(backControls, `${route} back controls`).toHaveCount(expectedCount);
        if (expectedCount) await expect(backControls).toBeVisible();
        if (width > 760) await expect(page.locator('.mobile-back-control')).toBeHidden();
        if (route === '/' || route.startsWith('/projects/') || route === '/missing')
          await expect(page.getByRole('navigation', { name: 'Page history' })).toHaveCount(0);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          `${route} horizontal overflow`,
        ).toBe(true);
        if (['/', '/about', '/projects/rae-jacob', '/missing'].includes(route))
          await page.screenshot({
            path: testInfo.outputPath(`${route.replaceAll('/', '-') || 'home'}.png`),
          });
      }
    });
  }
}

test('primary subpages offer one back button and Home has none', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ['/projects', '/about', '/contact', '/achievements']) {
    await page.goto(route);
    const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
    await expect(previous).toBeVisible();
    await expect(previous).toHaveText('Back to Home');
    await expect(previous).toBeEnabled();
    await previous.click();
    await expect(page).toHaveURL('/');
    await expect(previous).toHaveCount(0);
    await expect(page.locator('main')).toBeFocused();
  }
});

test('Back navigation retraces navigation without creating a back-button loop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  const visit = async (name) => {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await navigation.getByRole('link', { name, exact: true }).click();
  };
  await expect(previous).toHaveCount(0);
  await visit('About');
  await expect(previous).toHaveText('Back to Home');
  await visit('Contact');
  await expect(previous).toHaveText('Back to About');
  await visit('Certificates');
  await expect(previous).toHaveText('Back to Contact');
  for (const route of ['/contact', '/about', '/']) {
    await previous.click();
    await expect(page).toHaveURL(route);
    if (route !== '/')
      await expect(previous).toHaveText(route === '/contact' ? 'Back to About' : 'Back to Home');
  }
  await expect(previous).toHaveCount(0);
  await page.goForward();
  await expect(page).toHaveURL('/about');
  await expect(previous).toBeEnabled();
  await previous.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
  await expect(previous).toHaveCount(0);
  await visit('About');
  await visit('Home');
  await expect(previous).toHaveCount(0);
  await page.reload();
  await expect(previous).toHaveCount(0);
});

test('Back navigation preserves filtered collections and referring route state after reload', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects?q=Pocket#project-index');
  await page.getByRole('link', { name: 'View project', exact: true }).click();
  await page.reload();
  const previous = page.getByRole('link', { name: 'Back to projects', exact: true });
  await expect(page.getByRole('navigation', { name: 'Page history' })).toHaveCount(0);
  await previous.click();
  await expect(page).toHaveURL('/projects?q=Pocket#project-index');
  await expect(page.getByRole('searchbox')).toHaveValue('Pocket');
  await expect(page.locator('.work-card')).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveURL('/projects/pocket-quest');
  await expect(page.getByRole('navigation', { name: 'Page history' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Back to projects', exact: true })).toHaveAttribute(
    'href',
    '/projects?q=Pocket#project-index',
  );
});

test('project return links unwind history so the collection goes back Home after a reload', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Projects', exact: true })
    .click();
  await page.getByRole('searchbox').fill('Pocket');
  await expect(page).toHaveURL('/projects?q=Pocket');
  await page.getByRole('link', { name: 'View project', exact: true }).click();
  await expect(page).toHaveURL('/projects/pocket-quest');
  await page.locator('.next-project').click();
  await page.getByRole('link', { name: 'Back to Pocket Quest', exact: true }).click();
  await expect(page).toHaveURL('/projects/pocket-quest');
  await page.reload();
  await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
  await expect(page).toHaveURL('/projects?q=Pocket');
  const back = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
  await expect(back).toHaveText('Back to Home');
  await page.reload();
  await expect(back).toHaveText('Back to Home');
  await back.click();
  await expect(page).toHaveURL('/');
  await page.goForward();
  await expect(page).toHaveURL('/projects?q=Pocket');
  await expect(back).toHaveText('Back to Home');
});

test('direct project fallback replaces the entry instead of creating a return loop', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects/wellbot');
  await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
  await expect(page).toHaveURL('/projects');
  const back = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
  await expect(back).toHaveText('Back to Home');
  await back.click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('navigation', { name: 'Page history' })).toHaveCount(0);
});

test('back controls update at the mobile breakpoint without reserving desktop space', async ({
  page,
}) => {
  for (const route of ['/about', '/projects/rae-jacob', '/missing']) {
    await page.goto(route);
    const backControl = page.locator('.mobile-back-control');
    for (const width of [760, 761, 1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      if (width <= 760) await expect(backControl).toBeVisible();
      else {
        await expect(backControl).toBeHidden();
        await expect(backControl).toHaveCSS('display', 'none');
      }
    }
  }
});

test('back labels name project destinations and wrap on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/projects/rae-jacob');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Contact', exact: true })
    .click();
  const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
  await expect(previous).toHaveText('Back to Rae Jacob: Beyond the Balete');
  await page.reload();
  await expect(previous).toHaveText('Back to Rae Jacob: Beyond the Balete');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await previous.click();
  await expect(page).toHaveURL('/projects/rae-jacob');
});

test('Back navigation fits mobile layouts and works alongside the menu in both themes', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 });
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'About', exact: true })
      .click();
    const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
    await expect(previous).toBeInViewport();
    const buttonBox = await previous.boundingBox();
    expect(buttonBox.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: testInfo.outputPath(`previous-${colorScheme}-320.png`) });
    await previous.click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  }
});
