import { test, expect } from '@playwright/test';

test('featured display is controlled by the visitor and keeps keyboard focus', async ({ page }) => {
  await page.goto('/projects');
  const selector = page.getByRole('button', { name: 'Select featured project Pickle Batangas' });
  await selector.focus();
  await page.keyboard.press('Enter');
  await expect(selector).toHaveAttribute('aria-pressed', 'true');
  await expect(selector).toBeFocused();
  await expect(page.locator('.featured-caption')).toContainText('Pickle Batangas');
  await expect(page.locator('.featured-image img')).toHaveAttribute(
    'src',
    '/projects/pickletayo.jpg',
  );
  await page.getByRole('link', { name: 'Explore featured project Pickle Batangas' }).click();
  await expect(page).toHaveURL('/projects/pickletayo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pickle Batangas');
});

test('technology filtering matches exact stacks, persists, and composes with other controls', async ({
  page,
}) => {
  await page.goto('/projects');
  const technology = page.getByRole('combobox', { name: 'Filter by technology' });
  await technology.selectOption('React Native');
  await expect(page.locator('.work-card')).toHaveCount(2);
  await expect(page).toHaveURL(/tech=React\+Native/);
  await page.reload();
  await expect(technology).toHaveValue('React Native');
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await page.getByRole('combobox', { name: 'Sort projects' }).selectOption('name');
  await page.locator('.work-card h2').first().getByRole('link').click();
  await page.getByRole('link', { name: 'Project collection' }).click();
  await expect(technology).toHaveValue('React Native');
  await expect(page.locator('.project-results')).toHaveClass(/list-view/);
  await page.getByRole('checkbox', { name: /Live demos only/ }).check();
  await expect(page.getByRole('heading', { name: 'No projects found' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(technology).toHaveValue('');
  await expect(page.locator('.work-card')).toHaveCount(11);
  await expect(page.getByRole('combobox', { name: 'Sort projects' })).toHaveValue('name');
  await technology.selectOption('React');
  await expect(page.locator('.work-card')).toHaveCount(7);
  await expect(page.locator('.work-card h2')).not.toContainText(['Eventure']);
});

test('case study chapters and grouped stacks connect to the collection', async ({ page }) => {
  await page.goto('/projects/aedescapella');
  const chapters = page.getByRole('navigation', { name: 'Case study chapters' });
  await chapters.getByRole('link', { name: /The approach/ }).click();
  await expect(page).toHaveURL(/#case-approach$/);
  const box = await page.locator('#case-approach').boundingBox();
  expect(box.y).toBeGreaterThan(90);
  expect(box.y).toBeLessThan(150);
  await expect(page.locator('.case-stack')).toContainText('Device & intelligence');
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
  await page.getByRole('link', { name: 'Project collection' }).click();
  await expect(page.getByRole('combobox', { name: 'Filter by technology' })).toHaveValue(
    'Supabase',
  );
});

test('featured transitions pause and phone index controls stay compact', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/projects');
  await page.getByRole('button', { name: 'Select featured project MedTech Mate' }).click();
  await expect(page.locator('.featured-stage')).toHaveCSS('animation-name', 'project-focus-in');
  await page.getByRole('button', { name: 'Pause animations' }).click();
  await expect(page.locator('.featured-stage')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const size of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(size);
    await page.goto('/projects?view=list#project-index');
    const sort = await page.locator('.sort-field').boundingBox();
    expect(sort.width).toBeLessThan(210);
    await expect(page.locator('.work-card').first()).toBeVisible();
    const preview = await page.locator('.work-card .preview-button').first().boundingBox();
    expect(preview.height).toBeLessThanOrEqual(44);
    const width = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    expect(width.page).toBeLessThanOrEqual(width.viewport + 1);
  }
});
