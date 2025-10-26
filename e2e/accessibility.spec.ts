import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have proper page titles', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Travel/i);

    await page.goto('/login');
    await expect(page).toHaveTitle(/Travel/i);

    await page.goto('/signup');
    await expect(page).toHaveTitle(/Travel/i);
  });

  test('should have accessible form labels on login page', async ({ page }) => {
    await page.goto('/login');

    // All form inputs should have associated labels
    const emailInput = page.getByLabel('Email Address');
    const passwordInput = page.getByLabel('Password');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should have accessible form labels on signup page', async ({
    page,
  }) => {
    await page.goto('/signup');

    // All form inputs should have associated labels
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email Address')).toBeVisible();
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible();
    await expect(page.getByLabel('Confirm Password')).toBeVisible();
    await expect(page.getByLabel('I am a')).toBeVisible();
  });

  test('should have proper button roles', async ({ page }) => {
    await page.goto('/login');

    const signInButton = page.getByRole('button', { name: 'Sign In' });
    await expect(signInButton).toBeVisible();
  });

  test('should have proper link roles', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('should support keyboard navigation on home page', async ({ page }) => {
    await page.goto('/');

    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to activate link with Enter
    await page.keyboard.press('Enter');

    // Wait for navigation
    await page.waitForTimeout(1000);
  });

  test('should support keyboard navigation in login form', async ({ page }) => {
    await page.goto('/login');

    // Tab to email field
    await page.keyboard.press('Tab');
    await page.keyboard.type('test@example.com');

    // Tab to password field
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');

    // Verify inputs received values
    await expect(page.getByLabel('Email Address')).toHaveValue(
      'test@example.com'
    );
    await expect(page.getByLabel('Password')).toHaveValue('password123');
  });

  test('should have proper heading hierarchy on home page', async ({
    page,
  }) => {
    await page.goto('/');

    // Should have main heading
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('should have proper heading hierarchy on login page', async ({
    page,
  }) => {
    await page.goto('/login');

    // Should have main heading
    const heading = page.getByRole('heading', { name: 'Sign In' });
    await expect(heading).toBeVisible();
  });

  test('should have proper heading hierarchy on signup page', async ({
    page,
  }) => {
    await page.goto('/signup');

    // Should have main heading
    const heading = page.getByRole('heading', { name: 'Sign Up' });
    await expect(heading).toBeVisible();
  });

  test('should have visible focus indicators', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.getByLabel('Email Address');
    await emailInput.focus();

    // Check if element is focused
    await expect(emailInput).toBeFocused();
  });
});

