import { test, expect } from '@playwright/test';

const endpoint = 'https://formsubmit.co/ajax/arguellesrichmond@gmail.com';
async function fillMessage(page) {
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Portfolio Visitor');
  await page
    .getByRole('textbox', { name: 'Email address', exact: true })
    .fill('visitor@example.com');
  await page
    .getByRole('combobox', { name: 'What’s this about?' })
    .selectOption('Internship opportunity');
  await page
    .getByRole('textbox', { name: 'Your message', exact: true })
    .fill('I would like to discuss an internship opportunity with you.');
}

test('pending activation is explained without claiming a message was sent', async ({ page }) => {
  await page.route(endpoint, (route) =>
    route.fulfill({ json: { success: 'false', message: 'This form needs Activation.' } }),
  );
  await page.goto('/contact');
  await fillMessage(page);
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('being activated');
  await expect(page.getByRole('status')).not.toContainText('Message submitted');
  await expect(page.locator('#contact-name')).toHaveValue('Portfolio Visitor');
});

test('a slow service times out and re-enables the form with input intact', async ({ page }) => {
  await page.clock.install();
  let request;
  await page.route(endpoint, (route) => {
    request = route;
  });
  await page.goto('/contact');
  await fillMessage(page);
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sending…', exact: true })).toBeDisabled();
  await expect.poll(() => Boolean(request)).toBe(true);
  await page.clock.fastForward(21000);
  await expect(page.getByRole('status')).toContainText('could not be sent');
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeEnabled();
  await expect(page.locator('#contact-email')).toHaveValue('visitor@example.com');
  await request.abort().catch(() => {});
});

test('contact validates input, submits inline, prevents duplicates, and resets after acceptance', async ({
  page,
}) => {
  let requests = 0;
  let payload;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    requests++;
    payload = route.request().postDataJSON();
    await gate;
    await route.fulfill({ json: { success: 'true', message: 'Form submitted successfully' } });
  });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  expect(requests).toBe(0);
  await expect(page.locator('#contact-name')).toBeFocused();
  await fillMessage(page);
  await page.locator('#contact-email').fill('invalid-email');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  expect(requests).toBe(0);
  await expect(page.locator('#contact-email')).toBeFocused();
  await page.locator('#contact-email').fill('visitor@example.com');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sending…', exact: true })).toBeDisabled();
  await page
    .locator('.contact-form')
    .evaluate((form) =>
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })),
    );
  await expect.poll(() => requests).toBe(1);
  expect(payload).toMatchObject({
    name: 'Portfolio Visitor',
    email: 'visitor@example.com',
    topic: 'Internship opportunity',
    _subject: 'Portfolio enquiry: Internship opportunity',
    _honey: '',
    _template: 'table',
  });
  expect(payload.message).toContain('internship opportunity');
  release();
  await expect(page.getByRole('status')).toContainText('Message submitted');
  await expect(page).toHaveURL('/contact');
  await expect(page.locator('#contact-message')).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeEnabled();
});

test('contact keeps details after a rejected request and allows retry', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, async (route) => {
    requests++;
    await route.fulfill({ json: { success: requests > 1 } });
  });
  await page.goto('/contact');
  await fillMessage(page);
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('could not be sent');
  await expect(page.locator('#contact-name')).toHaveValue('Portfolio Visitor');
  expect(await page.locator('#contact-message').inputValue()).toContain('internship opportunity');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Message submitted');
  expect(requests).toBe(2);
});

test('contact handles network failure and rejects whitespace or honeypot submissions', async ({
  page,
}) => {
  let requests = 0;
  await page.route(endpoint, async (route) => {
    requests++;
    await route.abort();
  });
  await page.goto('/contact');
  await fillMessage(page);
  await page.locator('#contact-message').fill(' '.repeat(25));
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  expect(requests).toBe(0);
  await expect(page.locator('#contact-message')).toBeFocused();
  await page.locator('#contact-message').fill('I would like to discuss a project with you.');
  await page.locator('#contact-website').evaluate((input) => {
    input.value = 'spam';
  });
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  expect(requests).toBe(0);
  await page.locator('#contact-website').evaluate((input) => {
    input.value = '';
  });
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('could not be sent');
  await expect(page.locator('#contact-email')).toHaveValue('visitor@example.com');
  expect(requests).toBe(1);
});
