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

test('supplied phone screenshots keep their proportions, originals, and enlargement controls', async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  const mobileProjects = projects.filter((project) => project.imageLayout === 'portrait');
  expect(mobileProjects).toHaveLength(4);
  await page.goto('/projects?category=Mobile');
  await expect(page.locator('.work-card')).toHaveCount(4);
  for (const project of mobileProjects) {
    const card = page
      .locator('.work-card')
      .filter({ has: page.getByRole('heading', { name: project.title, exact: true }) });
    const thumbnail = card.locator('img');
    await thumbnail.scrollIntoViewIfNeeded();
    await expect(thumbnail).toHaveCSS('object-fit', 'contain');
    await page.goto(`/projects/${project.id}`);
    const image = page.locator('.project-screenshot img');
    await expect
      .poll(() => image.evaluate((img) => img.complete && img.naturalWidth > 0))
      .toBe(true);
    const sizes = await image.evaluate((img) => ({
      width: img.naturalWidth,
      height: img.naturalHeight,
      displayWidth: img.getBoundingClientRect().width,
      displayHeight: img.getBoundingClientRect().height,
    }));
    expect(sizes.width).toBe(project.imageWidth);
    expect(sizes.height).toBe(project.imageHeight);
    expect(
      Math.abs(sizes.displayWidth / sizes.displayHeight - sizes.width / sizes.height),
    ).toBeLessThan(0.02);
    await expect(page.locator('.screenshot-note')).toContainText('App screenshot');
    const original = await request.get(project.imageSource);
    expect(original.ok()).toBe(true);
    expect(original.headers()['content-type']).toContain('image/png');
    await page.getByRole('button', { name: 'Enlarge screenshot' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').locator('img')).toHaveAttribute('src', project.image);
    await page.getByRole('button', { name: 'Actual size', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Fit to screen', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Enlarge screenshot' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.goto('/projects?category=Mobile');
  }
});
