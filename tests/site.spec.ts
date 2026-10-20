import { test, expect } from '@playwright/test';

// --- Homepage ---
test.describe('Homepage', () => {
  test('renders wordmark and tagline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toHaveText('UUeird');
    await expect(page.locator('.tagline')).toBeVisible();
  });

  test('nav links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header nav a[href="/releases"]')).toBeVisible();
    await expect(page.locator('header nav a[href="/events"]')).toBeVisible();
    await expect(page.locator('header nav a[href="/swampstep"]')).toBeVisible();
    await expect(page.locator('header nav a[href="/about"]')).toBeVisible();
  });

  test('footer social links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer a[href="mailto:hello@uueird.com"]')).toBeVisible();
    await expect(page.locator('footer a[href="https://soundcloud.com/uueird"]')).toBeVisible();
    await expect(page.locator('footer a[href="https://uueird.bandcamp.com/"]')).toBeVisible();
    await expect(page.locator('footer a[href="https://x.com/UUeirdBass"]')).toBeVisible();
  });

  test('signup form submits to Mailchimp and shows the response', async ({ page }) => {
    let requested: URL | undefined;
    await page.route('**/subscribe/post-json**', (route) => {
      requested = new URL(route.request().url());
      const callback = requested.searchParams.get('c');
      route.fulfill({
        contentType: 'application/javascript',
        body: `${callback}(${JSON.stringify({ result: 'success', msg: 'Thank you for subscribing!' })})`,
      });
    });

    await page.goto('/');
    await page.fill('#signup input[name="EMAIL"]', 'test@example.com');
    await page.click('#signup button[type="submit"]');

    await expect(page.locator('#signup .status')).toHaveText('Thank you for subscribing!');
    expect(requested?.searchParams.get('u')).toBe('75f15b47333ffdb34d98a3e2e');
    expect(requested?.searchParams.get('id')).toBe('8c7d6b592d');
    expect(requested?.searchParams.get('EMAIL')).toBe('test@example.com');
    await expect(page.locator('#signup input[name="EMAIL"]')).toHaveValue('');
  });

  test('signup form shows Mailchimp errors without the field prefix', async ({ page }) => {
    await page.route('**/subscribe/post-json**', (route) => {
      const callback = new URL(route.request().url()).searchParams.get('c');
      route.fulfill({
        contentType: 'application/javascript',
        body: `${callback}(${JSON.stringify({ result: 'error', msg: '0 - Please enter a <b>valid</b> email' })})`,
      });
    });

    await page.goto('/');
    await page.fill('#signup input[name="EMAIL"]', 'bad@example.com');
    await page.click('#signup button[type="submit"]');

    await expect(page.locator('#signup .status')).toHaveText('Please enter a valid email');
    await expect(page.locator('#signup .status')).toHaveAttribute('data-result', 'error');
  });
});

// --- Navigation ---
test.describe('Navigation', () => {
  test('nav links load correct pages', async ({ page }) => {
    await page.goto('/');
    await page.click('header nav a[href="/releases"]');
    await expect(page).toHaveURL(/\/releases/);
    await expect(page.locator('main h1')).toHaveText('Releases');
  });

  test('wordmark navigates home from inner page', async ({ page }) => {
    await page.goto('/about');
    await page.click('header .wordmark');
    await expect(page).toHaveURL('/');
  });
});

// --- Releases page ---
test.describe('Releases', () => {
  test('renders release grid', async ({ page }) => {
    await page.goto('/releases');
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(18);
  });

  test('clicking a card opens the modal', async ({ page }) => {
    await page.goto('/releases');
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
    await page.locator('.card').first().click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
  });

  test('modal shows artist, title, and embed', async ({ page }) => {
    await page.goto('/releases');
    await page.locator('.card').first().click();
    await expect(page.locator('#modal-artist')).not.toBeEmpty();
    await expect(page.locator('#modal-title')).not.toBeEmpty();
    await expect(page.locator('#modal-embed')).toBeVisible();
  });

  test('modal shows release artwork behind the loading player', async ({ page }) => {
    await page.goto('/releases');
    const card = page.locator('.card').nth(1);
    const artwork = await card.getAttribute('data-artwork');
    await card.click();
    await expect(page.locator('#modal-art')).toHaveAttribute('src', artwork!);
    await expect(page.locator('#modal-art')).toBeVisible();
  });

  test('modal closes on backdrop click', async ({ page }) => {
    await page.goto('/releases');
    await page.locator('.card').first().click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
    // click a corner of the viewport well outside the modal card
    await page.mouse.click(10, 10);
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
  });

  test('modal closes on Escape', async ({ page }) => {
    await page.goto('/releases');
    await page.locator('.card').first().click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
  });

  test('modal links open in new tab', async ({ page }) => {
    await page.goto('/releases');
    await page.locator('.card').first().click();
    const links = page.locator('#modal-links a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(links.nth(i)).toHaveAttribute('target', '_blank');
    }
  });
});

// --- Mobile ---
test.describe('Mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14

  test('homepage renders correctly on mobile', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('releases grid renders on mobile', async ({ page }) => {
    await page.goto('/releases');
    await expect(page.locator('.grid')).toBeVisible();
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('modal opens and is usable on mobile', async ({ page }) => {
    await page.goto('/releases');
    await page.locator('.card').first().click();
    await expect(page.locator('#modal')).toHaveClass(/open/);
    await expect(page.locator('#modal-card')).toBeVisible();
    await expect(page.locator('#modal-close')).toBeVisible();
    await page.locator('#modal-close').click();
    await expect(page.locator('#modal')).not.toHaveClass(/open/);
  });
});

// --- Other pages ---
test.describe('Pages', () => {
  for (const path of ['/events', '/about', '/swampstep']) {
    test(`${path} loads without error`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('header nav')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });
  }

  test('404 page does not appear on valid routes', async ({ page }) => {
    for (const path of ['/', '/releases', '/events', '/about', '/swampstep']) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
    }
  });
});
