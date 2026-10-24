import { test, expect } from '@playwright/test';

test('Smart Classroom is discoverable by embedded category and C++ technology', async ({
  page,
}) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Embedded systems', exact: true }).click();
  await expect(page.locator('.work-card h2')).toHaveText(['AedesCapella', 'Smart Classroom']);
  await page.getByRole('combobox', { name: 'Filter by technology' }).selectOption('C++');
  await expect(page.locator('.work-card')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('.work-card h2')).toHaveText('Smart Classroom');
  await page.getByRole('link', { name: 'View project', exact: true }).click();
  await expect(page).toHaveURL('/projects/smart-classroom');
  await expect(page.locator('.project-role')).toContainText('Team IoT project');
  await expect(page.locator('.case-stack')).toContainText('C++');
  await expect(page.getByRole('link', { name: 'View source' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Visit live project' })).toHaveCount(0);
  await expect(page.locator('#case-outcome')).toContainText('prototype scale');
  await page.goBack();
  await expect(page.getByRole('combobox', { name: 'Filter by technology' })).toHaveValue('C++');
});

test('diagram is labeled correctly and supports mobile enlargement and About return paths', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto('/about');
  const coursework = page
    .locator('.skill-groups > div')
    .filter({ hasText: 'Data tools (coursework)' });
  await expect(coursework).toContainText('Jupyter Notebook');
  await expect(coursework).toContainText('Kaggle');
  await expect(page.locator('.about-intro-copy')).toContainText(
    'responsibility on the thesis team is the hardware',
  );
  await page.getByRole('link', { name: 'Smart Classroom', exact: true }).click();
  await expect(page.locator('.screenshot-note')).toContainText('System architecture');
  await expect(page.locator('.project-screenshot img')).toHaveCSS('object-fit', 'contain');
  const opener = page.getByRole('button', { name: 'Enlarge diagram' });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: 'Smart Classroom — architecture diagram' });
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Actual size' }).click();
  await expect(page.locator('.screenshot-stage')).toHaveClass(/is-zoomed/);
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: 'Back to about', exact: true }).click();
  await expect(page).toHaveURL('/about');
  await page.getByRole('link', { name: 'AedesCapella', exact: true }).click();
  await expect(page.locator('.project-role')).toContainText('responsible for hardware integration');
});
