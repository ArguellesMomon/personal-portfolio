import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('live demos and layout survive reload, details, and filter resets', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await page.getByRole('checkbox', { name: /Live demos only/ }).check();
  await page.getByRole('combobox', { name: 'Sort projects' }).selectOption('name');
  await expect(page.locator('.work-card')).toHaveCount(7);
  await expect(page.locator('.work-card h2').filter({ hasText: 'Node-RED' })).toHaveCount(0);
  await page.reload();
  await expect(page.locator('.project-results')).toHaveClass(/list-view/);
  await expect(page.getByRole('checkbox', { name: /Live demos only/ })).toBeChecked();
  await page
    .getByRole('heading', { name: 'C4A Fieldnotes', exact: true })
    .getByRole('link')
    .click();
  await page.getByRole('link', { name: 'Project collection' }).click();
  await expect(page.getByRole('checkbox', { name: /Live demos only/ })).toBeChecked();
  await page.getByRole('searchbox').fill('not-a-project');
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await expect(page.locator('.work-card')).toHaveCount(11);
  await expect(page.locator('.project-results')).toHaveClass(/list-view/);
  await expect(page.getByRole('combobox', { name: 'Sort projects' })).toHaveValue('name');
  await expect(page.getByRole('checkbox', { name: /Live demos only/ })).not.toBeChecked();
  await page.goto('/projects/node-red-dashboard');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Node-RED');
  await page.goto('/achievements');
  await expect(page).toHaveURL('/achievements');
  await expect(page.locator('.learning-entry')).toHaveCount(18);
});

for (const theme of ['light', 'dark']) {
  test(`screenshot viewer supports mobile zoom, focus, and accessibility in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript((value) => localStorage.setItem('portfolio-theme', value), theme);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects/aedescapella');
    const opener = page.getByRole('button', { name: 'Enlarge screenshot' });
    await opener.click();
    const dialog = page.getByRole('dialog', { name: /AedesCapella — screenshot/ });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close screenshot' })).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Actual size' })).toBeFocused();
    await page.getByRole('button', { name: 'Actual size' }).click();
    await expect(page.getByRole('button', { name: 'Fit to screen' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect
      .poll(() =>
        page
          .locator('.screenshot-stage')
          .evaluate((element) => element.scrollWidth > element.clientWidth),
      )
      .toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.getByRole('button', { name: 'Fit to screen' }).click();
    await expect(page.locator('.screenshot-stage')).not.toHaveClass(/is-zoomed/);
    await page.setViewportSize({ width: 844, height: 390 });
    await expect
      .poll(() =>
        page
          .locator('.screenshot-controls')
          .evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight),
      )
      .toBe(true);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  });
}

test('contact draft restores on reload, offers a prefilled fallback, and clears after success', async ({
  page,
}) => {
  let accepted = false;
  await page.route('https://formsubmit.co/ajax/arguellesrichmond@gmail.com', (route) =>
    route.fulfill({ json: { success: accepted } }),
  );
  await page.goto('/contact');
  await page.locator('#contact-name').fill('Visitor');
  await page.locator('#contact-email').fill('visitor@example.com');
  await page.locator('#contact-message').fill('I have an idea for a useful project.');
  await expect(page.getByText('Draft saved in this tab', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('#contact-name')).toHaveValue('Visitor');
  await expect(page.locator('#contact-message')).toHaveValue(
    'I have an idea for a useful project.',
  );
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  const fallback = page.getByRole('link', { name: 'Send with your email app' });
  await expect(fallback).toBeVisible();
  const email = new URL(await fallback.getAttribute('href'));
  expect(email.searchParams.get('subject')).toBe('Portfolio enquiry: Collaboration');
  expect(email.searchParams.get('body')).toContain('I have an idea for a useful project.');
  expect(email.searchParams.get('body')).toContain('visitor@example.com');
  accepted = true;
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Message submitted');
  await expect(page.locator('#contact-name')).toHaveValue('');
  expect(await page.evaluate(() => sessionStorage.getItem('portfolio-contact-draft'))).toBeNull();
  await page.reload();
  await expect(page.locator('#contact-message')).toHaveValue('');
  await page.locator('#contact-name').fill('New draft');
  await page.getByRole('button', { name: 'Clear draft' }).click();
  await expect(page.locator('#contact-name')).toHaveValue('');
  expect(await page.evaluate(() => sessionStorage.getItem('portfolio-contact-draft'))).toBeNull();
});

test('contact still submits when browser storage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('Storage disabled');
    };
    Storage.prototype.setItem = () => {
      throw new Error('Storage disabled');
    };
    Storage.prototype.removeItem = () => {
      throw new Error('Storage disabled');
    };
  });
  await page.route('https://formsubmit.co/ajax/arguellesrichmond@gmail.com', (route) =>
    route.fulfill({ json: { success: true } }),
  );
  await page.goto('/contact');
  await page.locator('#contact-name').fill('Visitor');
  await page.locator('#contact-email').fill('visitor@example.com');
  await page.locator('#contact-message').fill('I have an idea for a useful project.');
  await expect(
    page.getByText('Your draft is kept while this page is open', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Message submitted');
});

test('mobile brand marks use SVG and every featured project stays visible', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173/');
  await expect(page.locator('.wave-hand svg')).toHaveCount(1);
  await expect(page.locator('.spark-one svg')).toHaveCount(1);
  expect(await page.locator('.hero-section').innerText()).not.toContain('✳');
  await expect(page.locator('.selected-work .work-card')).toHaveCount(3);
  for (const card of await page.locator('.selected-work .work-card').all())
    await expect(card).toBeVisible();
  await context.close();
});
