import { readFileSync, readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const certificates = JSON.parse(
  readFileSync(new URL('../src/data/achievements.json', import.meta.url), 'utf8'),
);

test('every supplied record can be inspected and has a working original file', async ({
  page,
  request,
}) => {
  const files = readdirSync(new URL('../src/Certificates/', import.meta.url), {
    recursive: true,
    withFileTypes: true,
  }).filter((file) => file.isFile());
  expect(certificates).toHaveLength(files.length);
  expect(new Set(certificates.map((item) => item.sourceFile)).size).toBe(files.length);
  await page.goto('/achievements');
  await expect(page.locator('.learning-entry')).toHaveCount(certificates.length);
  const desk = page.getByRole('complementary', { name: 'Selected certificate' });
  for (const item of certificates) {
    const entry = page.getByRole('button', {
      name: 'Explore certificate: ' + item.title,
      exact: true,
    });
    await entry.click();
    await expect(entry).toHaveAttribute('aria-pressed', 'true');
    await expect(desk.getByRole('heading')).toHaveText(item.title);
    await expect
      .poll(() => desk.locator('img').evaluate((image) => image.complete && image.naturalWidth > 0))
      .toBe(true);
    const url = await desk
      .getByRole('link', { name: 'Open original certificate: ' + item.title, exact: true })
      .getAttribute('href');
    expect(url).toBeTruthy();
    const original = await request.get(url);
    expect(original.ok()).toBe(true);
    expect(original.headers()['content-type']).toContain(
      item.sourceFile.endsWith('.pdf') ? 'application/pdf' : 'image/png',
    );
    await expect(desk.locator('time')).toHaveAttribute('datetime', item.date);
    await expect(
      desk.getByRole('link', { name: 'Download certificate: ' + item.title, exact: true }),
    ).toHaveAttribute('download', item.sourceFile.split('/').pop());
  }
});

test('archive filters, search recovery, and mobile entry navigation work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'Certificates' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('An unfinished');
  const categories = page.getByRole('group', { name: 'Certificate category' });
  await categories.getByRole('button', { name: /Courses/ }).click();
  await expect(page.locator('.learning-entry')).toHaveCount(8);
  await page.getByRole('searchbox', { name: 'Search certificates' }).fill('PyTorch');
  await expect(page.locator('.learning-entry')).toHaveCount(1);
  await page.getByRole('searchbox').fill('no match');
  await expect(page.getByText('No records on this page.')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search & filters' }).click();
  await expect(page.locator('.learning-entry')).toHaveCount(18);
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await categories.getByRole('button', { name: /Rooms I showed up in/ }).click();
  await expect(page.locator('.learning-entry')).toHaveCount(9);
  await categories.getByRole('button', { name: /Recognition/ }).click();
  await expect(page.locator('.learning-entry')).toHaveCount(1);
  const entry = page.locator('.learning-entry button');
  await entry.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(entry).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const theme of ['light', 'dark']) {
  test(
    'document viewer contains focus and supports mobile enlargement in ' + theme,
    async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem('portfolio-theme', value), theme);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/achievements');
      const opener = page.getByRole('button', { name: 'Explore academic recognition certificate' });
      await opener.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(page.getByRole('button', { name: 'Close certificate' })).toBeFocused();
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByRole('button', { name: 'Enlarge preview' })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.getByRole('button', { name: 'Close certificate' })).toBeFocused();
      await page.getByRole('button', { name: 'Enlarge preview' }).click();
      await expect(page.getByRole('button', { name: 'Fit to screen' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(
        await page
          .locator('.archive-viewer-stage')
          .evaluate((element) => element.scrollWidth > element.clientWidth),
      ).toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      expect(results.violations).toEqual([]);
      await page.getByRole('button', { name: 'Fit to screen' }).click();
      await page.setViewportSize({ width: 844, height: 390 });
      expect(
        await page
          .locator('.archive-viewer-footer')
          .evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight),
      ).toBe(true);
      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(opener).toBeFocused();
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
    },
  );
}
