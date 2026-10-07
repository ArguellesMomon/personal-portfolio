import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const projects = JSON.parse(
  readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'),
);
test('real project screenshots load with correct source and live links', async ({ page }) => {
  for (const project of projects.filter((item) => item.image)) {
    await page.goto(`/projects/${project.id}`);
    const image = page.locator('.real-art img');
    await expect(image).toBeVisible();
    await expect
      .poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0))
      .toBe(true);
    await expect(image).toHaveAttribute('alt', project.imageAlt);
    await expect(page.getByRole('link', { name: 'View original' })).toHaveAttribute(
      'href',
      project.imageSource,
    );
    await expect(page.getByRole('link', { name: 'View source' })).toHaveAttribute(
      'href',
      project.links.github,
    );
    if (project.links.live)
      await expect(page.getByRole('link', { name: 'Visit live project' })).toHaveAttribute(
        'href',
        project.links.live,
      );
  }
});
