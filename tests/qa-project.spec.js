import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const workbook =
  'https://docs.google.com/spreadsheets/d/1rzdius28Hi_dUCvXH4OV7QybftI3SypZpTQPfyOspOg/htmlview#gid=1280056387';

test('IRIS is discoverable as QA work and its workbook opens independently of live demos', async ({
  page,
  context,
}) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Embedded systems', exact: true }).click();
  await expect(page.locator('.work-card')).toHaveCount(1);
  await expect(page.locator('.work-card h2')).toHaveText('AedesCapella');
  await page.getByRole('button', { name: 'Software QA', exact: true }).click();
  await expect(page).toHaveURL(/category=QA/);
  await expect(page.locator('.work-card')).toHaveCount(1);
  await expect(page.locator('.work-card h2')).toHaveText('IRIS QA Testing');
  await expect(page.locator('.work-card')).not.toContainText('Raspberry Pi');
  await expect(
    page.getByRole('link', { name: 'View IRIS QA Testing QA workbook' }),
  ).toHaveAttribute('href', workbook);
  await page.getByRole('link', { name: 'View project', exact: true }).click();
  await expect(page.locator('.project-role')).toContainText('QA tester on the evaluation team');
  await expect(page.getByRole('heading', { name: 'Methods & tools', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Testing approach', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Implementation', exact: true })).toHaveCount(0);
  await expect(page.getByText('No public screenshot available', { exact: true })).toHaveCount(0);
  await expect(page.locator('.qa-evidence')).toContainText(
    'Team workbook: 157 passed and 2 failed cases.',
  );
  await expect(page.locator('.qa-coverage dd')).toHaveText(['30', '21', '108']);
  const link = page.getByRole('link', { name: 'View QA workbook', exact: true });
  await expect(link).toHaveAttribute('href', workbook);
  await expect(link).toHaveAttribute('target', '_blank');
  // Public access is checked separately; keep this navigation test deterministic.
  await context.route('https://docs.google.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<title>QA workbook</title><p>Read-only workbook</p>',
    }),
  );
  const popupPromise = page.waitForEvent('popup');
  await link.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(workbook);
  await popup.close();
  await page.goBack();
  await expect(page).toHaveURL(/category=QA/);
  await page.getByRole('combobox', { name: 'Filter by technology' }).selectOption('Manual Testing');
  await expect(page.locator('.work-card h2')).toHaveText('IRIS QA Testing');
});

test('QA evidence remains readable and accessible in both themes and on phones', async ({
  page,
}) => {
  for (const colorScheme of ['light', 'dark'])
    for (const width of [320, 1440]) {
      await page.emulateMedia({ colorScheme });
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/projects/iris');
      await expect(page.getByRole('link', { name: 'View QA workbook', exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    }
  await page.goto('/about');
  await expect(page.locator('.skill-groups')).toContainText('Software QA');
  await expect(page.locator('.skill-groups')).not.toContainText('Raspberry Pi');
});
