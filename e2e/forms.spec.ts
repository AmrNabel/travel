import { test, expect } from '@playwright/test';

test.describe('Form Validation', () => {
  test.describe('Login Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('should display login form', async ({ page }) => {
      await expect(page.getByLabel('Email Address')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Sign In' })
      ).toBeVisible();
    });

    test('should accept email input', async ({ page }) => {
      await page.getByLabel('Email Address').fill('test@example.com');
      await expect(page.getByLabel('Email Address')).toHaveValue(
        'test@example.com'
      );
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
      await expect(page.getByLabel('Name')).toBeVisible();
      await expect(page.getByLabel('Email Address')).toBeVisible();
      await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
      await expect(page.getByLabel('Confirm Password')).toBeVisible();
      await expect(page.getByLabel('I am a')).toBeVisible();
      await expect(
        page.getByRole('button', { name: 'Sign Up' })
      ).toBeVisible();
    });

    test('should accept name input', async ({ page }) => {
      await page.getByLabel('Name').fill('John Doe');
      await expect(page.getByLabel('Name')).toHaveValue('John Doe');
    });

    test('should accept email input', async ({ page }) => {
      await page.getByLabel('Email Address').fill('john@example.com');
      await expect(page.getByLabel('Email Address')).toHaveValue(
        'john@example.com'
      );
    });

    test('should show role options when clicked', async ({ page }) => {
      await page.getByLabel('I am a').click();
      await expect(page.getByRole('option', { name: 'Traveler' })).toBeVisible(
        { timeout: 2000 }
      );
      await expect(page.getByRole('option', { name: 'Sender' })).toBeVisible();
      await expect(page.getByRole('option', { name: 'Both' })).toBeVisible();
    });

    test('should select traveler role', async ({ page }) => {
      await page.getByLabel('I am a').click();
      await page.getByRole('option', { name: 'Traveler' }).click();
      // After selection, the dropdown should close
      await page.waitForTimeout(500);
    });

    test('should select sender role', async ({ page }) => {
      await page.getByLabel('I am a').click();
      await page.getByRole('option', { name: 'Sender' }).click();
      await page.waitForTimeout(500);
    });

    test('should fill complete signup form', async ({ page }) => {
      const timestamp = Date.now();

      await page.getByLabel('Name').fill('Test User');
      await page.getByLabel('Email Address').fill(`test${timestamp}@example.com`);
      await page.getByLabel('Password', { exact: true }).fill('Password123!');
      await page.getByLabel('Confirm Password').fill('Password123!');
      await page.getByLabel('I am a').click();
      await page.getByRole('option', { name: 'Both' }).click();

      // Verify all fields are filled
      await expect(page.getByLabel('Name')).toHaveValue('Test User');
      await expect(page.getByLabel('Email Address')).toHaveValue(
        `test${timestamp}@example.com`
      );
      await expect(page.getByLabel('Password', { exact: true })).toHaveValue(
        'Password123!'
      );
      await expect(page.getByLabel('Confirm Password')).toHaveValue(
        'Password123!'
      );
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

