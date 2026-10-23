import { test, expect } from '@playwright/test';

test('Back navigation is available on every route with a home fallback for direct visits', async ({
  page,
}) => {
  for (const route of [
    '/projects',
    '/about',
    '/contact',
    '/achievements',
    '/projects/wellbot',
    '/projects/invalid',
    '/missing',
  ]) {
    await page.goto(route);
    const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
    await expect(previous).toBeVisible();
    await expect(previous).toHaveText('Back to Home');
    await expect(previous).toBeEnabled();
    await previous.click();
    await expect(page).toHaveURL('/');
    await expect(previous).toBeDisabled();
    await expect(page.locator('main')).toBeFocused();
  }
});

test('Back navigation retraces navigation without creating a back-button loop', async ({
  page,
}) => {
  await page.goto('/');
  const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(previous).toBeDisabled();
  await navigation.getByRole('link', { name: 'About', exact: true }).click();
  await expect(previous).toHaveText('Back to Home');
  await navigation.getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(previous).toHaveText('Back to About');
  await navigation.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(previous).toBeEnabled();
  await expect(previous).toHaveText('Back to Contact');
  for (const route of ['/contact', '/about', '/']) {
    await previous.click();
    await expect(page).toHaveURL(route);
    await expect(previous).toHaveText(route === '/contact' ? 'Back to About' : 'Back to Home');
  }
  await expect(previous).toBeDisabled();
  await page.goForward();
  await expect(page).toHaveURL('/about');
  await expect(previous).toBeEnabled();
  await previous.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
  await expect(previous).toBeDisabled();
});

test('Back navigation preserves filtered collections and referring route state after reload', async ({
  page,
}) => {
  await page.goto('/projects?q=Pocket#project-index');
  await page.getByRole('link', { name: 'View project', exact: true }).click();
  await page.reload();
  const previous = page.getByRole('navigation', { name: 'Page history' }).getByRole('button');
  await expect(previous).toHaveText('Back to Projects');
  await previous.click();
  await expect(page).toHaveURL('/projects?q=Pocket#project-index');
  await expect(page.getByRole('searchbox')).toHaveValue('Pocket');
  await expect(page.locator('.work-card')).toHaveCount(1);
  await page.goForward();
  await expect(page).toHaveURL('/projects/pocket-quest');
  await expect(previous).toHaveText('Back to Projects');
  await expect(page.getByRole('link', { name: 'Back to projects', exact: true })).toHaveAttribute(
    'href',
    '/projects?q=Pocket#project-index',
  );
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
