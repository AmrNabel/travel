import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page with sign in and sign up buttons', async ({
    page,
  }) => {
    await expect(page.getByText('Travel Delivery Platform')).toBeVisible();
    await expect(
      page.getByText(
        'Connect travelers with senders for affordable and reliable delivery'
      )
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await page.waitForURL('/signup');
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  });

  test('should show validation errors on empty login form', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Sign In' }).click();
    // The form should not submit and stay on the same page
    await expect(page).toHaveURL('/login');
  });

  test('should show validation errors on empty signup form', async ({
    page,
  }) => {
    await page.goto('/signup');
    await page.getByRole('button', { name: 'Sign Up' }).click();
    // The form should not submit and stay on the same page
    await expect(page).toHaveURL('/signup');
  });

  test('should fill signup form with valid data', async ({ page }) => {
    await page.goto('/signup');

    // Generate unique email for testing
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;

    // Fill in the form
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email Address').fill(testEmail);
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password123!');

    // Select role (click on the select dropdown)
    await page.getByLabel('I am a').click();
    await page.getByRole('option', { name: 'Traveler' }).click();

    // The form should be filled correctly
    await expect(page.getByLabel('Name')).toHaveValue('Test User');
    await expect(page.getByLabel('Email Address')).toHaveValue(testEmail);
  });

  test('should navigate back to home from login page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should navigate back to home from signup page', async ({ page }) => {
    await page.goto('/signup');
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('should navigate between login and signup pages', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.waitForURL('/signup');
    await expect(page).toHaveURL('/signup');

    await page.getByRole('link', { name: 'Sign in' }).click();
    await page.waitForURL('/login');
    await expect(page).toHaveURL('/login');
  });
});

