import { test, expect } from '@playwright/test';

test('technology filters match exact stacks and persist through project navigation', async ({
  page,
}) => {
  await page.goto('/projects');
  const technology = page.getByRole('combobox', { name: 'Filter by technology' });
  await technology.selectOption('React Native');
  await expect(page.locator('.work-card')).toHaveCount(2);
  await expect(page).toHaveURL(/tech=React\+Native/);
  await page.reload();
  await expect(technology).toHaveValue('React Native');
  await page.locator('.work-card h2').first().getByRole('link').click();
  await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
  await expect(technology).toHaveValue('React Native');
  await page.getByRole('checkbox', { name: 'Live demos only' }).check();
  await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(technology).toHaveValue('');
  await expect(page.locator('.work-card')).toHaveCount(13);
  await technology.selectOption('React');
  await expect(page.locator('.work-card')).toHaveCount(9);
  await expect(page.locator('.work-card h2')).not.toContainText(['Eventure']);
});

test('case study sections and technology links connect to the collection', async ({ page }) => {
  await page.goto('/projects/aedescapella');
  await page
    .getByRole('navigation', { name: 'Case study sections' })
    .getByRole('link', { name: 'Implementation' })
    .click();
  await expect(page).toHaveURL(/#case-approach$/);
  const box = await page.locator('#case-approach').boundingBox();
  expect(box.y).toBeGreaterThan(90);
  expect(box.y).toBeLessThan(150);
  await expect(page.locator('.case-stack')).toContainText('Embedded & data');
  await page.locator('.case-stack').getByRole('link', { name: 'Supabase', exact: true }).click();
  await expect(page).toHaveURL(/tech=Supabase#project-index$/);
  await expect(page.getByRole('combobox', { name: 'Filter by technology' })).toHaveValue(
    'Supabase',
  );
  await expect(page.locator('.work-card')).toHaveCount(3);
  await page
    .getByRole('heading', { name: 'C4A Fieldnotes', exact: true })
    .getByRole('link')
    .click();
  await page.getByRole('link', { name: 'Back to projects', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Filter by technology' })).toHaveValue(
    'Supabase',
  );
});

test('phone visitors can filter and open projects without overflow', async ({ page }) => {
  for (const size of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/projects?q=Pocket');
    const card = page.locator('.work-card');
    await expect(card).toHaveCount(1);
    await expect(card.getByRole('heading')).toHaveText('Pocket Quest');
    await card.getByRole('link', { name: 'View project', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pocket Quest');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
});
