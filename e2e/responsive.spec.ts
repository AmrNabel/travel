import { test, expect, devices } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/');

    // Should display main content
    await expect(page.getByText('Travel Delivery Platform')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();

    await context.close();
  });

  test('should display correctly on tablet viewport', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPad Pro'],
    });
    const page = await context.newPage();

    await page.goto('/');

    await expect(page.getByText('Travel Delivery Platform')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();

    await context.close();
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.getByText('Travel Delivery Platform')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
  });

  test('should be usable on mobile for login form', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/login');

    // Should be able to interact with form on mobile
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    await expect(page.getByLabel('Email')).toHaveValue('test@example.com');

    await context.close();
  });

  test('should be usable on mobile for signup form', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/signup');

    // Should be able to interact with form on mobile
    await page.getByLabel('Full Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');

    await expect(page.getByLabel('Full Name')).toHaveValue('John Doe');

    await context.close();
  });

  test('should navigate correctly on mobile', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12'],
    });
    const page = await context.newPage();

    await page.goto('/');
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');

    // Navigate to signup
    await page.getByText('Sign Up').click();
    await page.waitForURL('/signup');
    await expect(page).toHaveURL('/signup');

    await context.close();
  });
});
