import { test, expect } from '@playwright/test';

const endpoint = 'https://formsubmit.co/ajax/arguellesrichmond@gmail.com';
async function fillMessage(page) {
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Portfolio Visitor');
  await page
    .getByRole('textbox', { name: 'Email address', exact: true })
    .fill('visitor@example.com');
  await page.getByRole('combobox', { name: 'Topic' }).selectOption('Internship opportunity');
  await page
    .getByRole('textbox', { name: 'Your message', exact: true })
    .fill('I would like to discuss an internship opportunity with you.');
}

test('message count follows typing, minimum validation, limits, and restored drafts', async ({
  page,
}) => {
  await page.goto('/contact');
  const message = page.getByRole('textbox', { name: 'Your message', exact: true });
  const count = page.locator('#message-count');
  const requirement = page.locator('#message-requirement');
  await expect(count).toHaveText('0 / 5,000 characters');
  await expect(requirement).toHaveText('20 more characters needed');
  await message.fill('a'.repeat(19));
  await expect(count).toHaveText('19 / 5,000 characters');
  await expect(requirement).toHaveText('1 more character needed');
  await message.press('End');
  await message.press('a');
  await expect(requirement).toHaveText('20-character minimum reached');
  await page.reload();
  await expect(count).toHaveText('20 / 5,000 characters');
  await expect(requirement).toHaveText('20-character minimum reached');
  await message.fill(' '.repeat(20));
  await expect(requirement).toHaveText('20 more characters needed');
  await message.fill('a'.repeat(5001));
  await expect(count).toHaveText('5,000 / 5,000 characters');
  await page.getByRole('button', { name: 'Clear draft' }).click();
  await expect(count).toHaveText('0 / 5,000 characters');
});

test('attachments enforce the combined size limit and can be removed or cleared', async ({
  page,
}) => {
  let requests = 0;
  await page.route('https://formsubmit.co/**', async (route) => {
    requests++;
    await route.abort();
  });
  await page.goto('/contact');
  await fillMessage(page);
  const picker = page.locator('#contact-attachments');
  await expect(picker).toHaveAttribute('multiple', '');
  await picker.setInputFiles([
    {
      name: 'brief.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(6_000_000),
    },
    {
      name: 'reference.png',
      mimeType: 'image/png',
      buffer: Buffer.alloc(5_000_000),
    },
  ]);
  await expect(
    page.getByRole('list', { name: 'Selected attachments' }).getByRole('listitem'),
  ).toHaveCount(2);
  await expect(page.getByRole('alert')).toContainText('exceed 10 MB');
  await page.getByRole('button', { name: 'Continue to send', exact: true }).click();
  expect(requests).toBe(0);
  await expect(picker).toBeFocused();
  await page.getByRole('button', { name: 'Remove attachment 2: reference.png' }).click();
  await expect(page.getByRole('alert')).toBeHidden();
  expect(await picker.evaluate((input) => [...input.files].map((file) => file.name))).toEqual([
    'brief.pdf',
  ]);
  const submittedFiles = await page
    .locator('.contact-form')
    .evaluate((form) =>
      [...new FormData(form).values()]
        .filter((value) => value instanceof File && value.name)
        .map((file) => ({ name: file.name, size: file.size })),
    );
  expect(submittedFiles).toEqual([{ name: 'brief.pdf', size: 6_000_000 }]);
  await picker.setInputFiles(
    Array.from({ length: 4 }, (_, index) => ({
      name: `brief-${index}.txt`,
      mimeType: 'text/plain',
      buffer: Buffer.from('brief'),
    })),
  );
  await expect(page.getByRole('alert')).toContainText('up to 3 files');
  await page.getByRole('button', { name: 'Continue to send', exact: true }).click();
  expect(requests).toBe(0);
  await page.getByRole('button', { name: 'Remove attachment 4: brief-3.txt' }).click();
  await expect(page.getByRole('alert')).toBeHidden();
  await expect(page.locator('input[type="file"]:visible')).toHaveCount(1);
  await page.getByRole('button', { name: 'Clear draft' }).click();
  await expect(page.locator('input[type="file"]')).toHaveCount(1);
  expect(await picker.evaluate((input) => input.files.length)).toBe(0);
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeEnabled();
});

test('selected files are not persisted with the text draft', async ({ page }) => {
  await page.goto('/contact');
  await fillMessage(page);
  await page.locator('#contact-attachments').setInputFiles({
    name: 'brief.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('Project brief'),
  });
  await page.reload();
  await expect(page.locator('#contact-name')).toHaveValue('Portfolio Visitor');
  expect(await page.locator('#contact-attachments').evaluate((input) => input.files.length)).toBe(
    0,
  );
  await expect(page.getByRole('button', { name: 'Send message', exact: true })).toBeVisible();
});

test('files use native multipart submission while retaining message and metadata', async ({
  page,
}) => {
  let uploadRequest;
  const uploadEndpoint = 'https://formsubmit.co/arguellesrichmond@gmail.com';
  await page.route(uploadEndpoint, async (route) => {
    uploadRequest = route.request();
    await route.fulfill({ contentType: 'text/html', body: '<h1>Test upload page</h1>' });
  });
  await page.goto('/contact');
  await fillMessage(page);
  await page.locator('#contact-attachments').setInputFiles(
    Array.from({ length: 3 }, (_, index) => ({
      name: `brief-${index}.txt`,
      mimeType: 'text/plain',
      buffer: Buffer.from(`Project brief ${index}`),
    })),
  );
  const files = await page.locator('.contact-form').evaluate(async (form) => {
    const data = new FormData(form);
    return Promise.all(
      [...data.entries()]
        .filter(([, value]) => value instanceof File && value.name)
        .map(async ([field, file]) => ({ field, name: file.name, content: await file.text() })),
    );
  });
  expect(files).toEqual([
    { field: 'attachment', name: 'brief-0.txt', content: 'Project brief 0' },
    { field: 'attachment2', name: 'brief-1.txt', content: 'Project brief 1' },
    { field: 'attachment3', name: 'brief-2.txt', content: 'Project brief 2' },
  ]);
  await page.getByRole('button', { name: 'Continue to send', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Test upload page' })).toBeVisible();
  expect(uploadRequest.method()).toBe('POST');
  expect(uploadRequest.headers()['content-type']).toContain('multipart/form-data; boundary=');
  const body = uploadRequest.postData();
  expect(body).toContain('Portfolio Visitor');
  expect(body).toContain('visitor@example.com');
  expect(body).toContain('Portfolio enquiry: Internship opportunity');
  expect(body).toContain('internship opportunity with you.');
});

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
