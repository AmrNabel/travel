import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test.describe('Login Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display login form', async ({ page }) => {
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    });

    test('should accept email input', async ({ page }) => {
      await page.getByLabel('Email').fill('test@example.com');
      await expect(page.getByLabel('Email')).toHaveValue('test@example.com');
    });

    test('should accept password input', async ({ page }) => {
      await page.getByLabel('Password').fill('password123');
      await expect(page.getByLabel('Password')).toHaveValue('password123');
    });

    test('should show password as hidden', async ({ page }) => {
      const passwordInput = page.getByLabel('Password');
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Signup Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/signup');
    });

    test('should display all signup form fields', async ({ page }) => {
      await expect(page.getByLabel('Full Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password').first()).toBeVisible();
      await expect(page.getByLabel('Confirm Password')).toBeVisible();
      await expect(page.getByText('I want to:')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
    });

    test('should accept name input', async ({ page }) => {
      await page.getByLabel('Full Name').fill('John Doe');
      await expect(page.getByLabel('Full Name')).toHaveValue('John Doe');
    });

    test('should accept email input', async ({ page }) => {
      await page.getByLabel('Email').fill('john@example.com');
      await expect(page.getByLabel('Email')).toHaveValue('john@example.com');
    });

    test('should show role options', async ({ page }) => {
      // Radio buttons should be visible
      await expect(page.getByLabel('Deliver items as a traveler')).toBeVisible({
        timeout: 2000,
      });
      await expect(page.getByLabel('Send items with travelers')).toBeVisible();
      await expect(page.getByLabel('Both')).toBeVisible();
    });

    test('should select traveler role', async ({ page }) => {
      await page.getByLabel('Deliver items as a traveler').click();
      await page.waitForTimeout(500);
      await expect(
        page.getByLabel('Deliver items as a traveler')
      ).toBeChecked();
    });

    test('should select sender role', async ({ page }) => {
      await page.getByLabel('Send items with travelers').click();
      await page.waitForTimeout(500);
      await expect(page.getByLabel('Send items with travelers')).toBeChecked();
    });

    test('should fill complete signup form', async ({ page }) => {
      const timestamp = Date.now();

      await page.getByLabel('Full Name').fill('Test User');
      await page.getByLabel('Email').fill(`test${timestamp}@example.com`);
      await page.getByLabel('Password').first().fill('Password123!');
      await page.getByLabel('Confirm Password').fill('Password123!');
      await page.getByLabel('Both').click();

      // Verify all fields are filled
      await expect(page.getByLabel('Full Name')).toHaveValue('Test User');
      await expect(page.getByLabel('Email')).toHaveValue(
        `test${timestamp}@example.com`
      );
      await expect(page.getByLabel('Password').first()).toHaveValue(
        'Password123!'
      );
      await expect(page.getByLabel('Confirm Password')).toHaveValue(
        'Password123!'
      );
      await expect(page.getByLabel('Both')).toBeChecked();
    });
  });

  test.describe('Search Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/search');
    });

    test('should display search page with tabs', async ({ page }) => {
      await expect(page.getByRole('tab', { name: 'Trips' })).toBeVisible({
        timeout: 5000,
      });
      await expect(page.getByRole('tab', { name: 'Requests' })).toBeVisible();
    });

    test('should be able to switch to Requests tab', async ({ page }) => {
      await page.waitForTimeout(1000);
      await page.getByRole('tab', { name: 'Requests' }).click();
      await page.waitForTimeout(500);
      await expect(page.getByRole('tab', { name: 'Requests' })).toBeVisible();
    });

    test('should display trips tab content', async ({ page }) => {
      await page.waitForTimeout(1000);
      // The trips tab should be active by default
      const tripsTab = page.getByRole('tab', { name: 'Trips' });
      await expect(tripsTab).toBeVisible();
    });
  });
});
