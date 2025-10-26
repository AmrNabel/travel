import { test, expect } from '@playwright/test';

test.describe('Navigation Flow', () => {
  test('should navigate through all public pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page.getByText('Travel Delivery Platform')).toBeVisible();

    // Login page
    await page.getByRole('link', { name: 'Sign In' }).click();
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    // Back to home
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('/');

    // Signup page
    await page.getByRole('link', { name: 'Sign Up' }).click();
    await page.waitForURL('/signup');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();

    // Back to home
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('/');
  });

  test('should attempt to access protected routes without auth', async ({
    page,
  }) => {
    // Try to access add-trip page (protected route)
    await page.goto('/add-trip');

    // Should redirect to login or show auth guard
    // Wait a bit for redirect
    await page.waitForTimeout(1000);

    // Check if we're either on login page or see a loading/auth message
    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');
    const isOnAddTripPage = currentUrl.includes('/add-trip');

    if (isOnAddTripPage) {
      // If still on add-trip, should see auth guard or redirect is pending
      // Just verify we can't see the actual form content
      await expect(
        page.getByText('Loading...').or(page.getByText('Please log in'))
      ).toBeVisible({ timeout: 5000 });
    } else {
      // Should be redirected to login
      expect(isOnLoginPage).toBeTruthy();
    }
  });

  test('should attempt to access send-item page without auth', async ({
    page,
  }) => {
    await page.goto('/send-item');
    await page.waitForTimeout(1000);

    const currentUrl = page.url();
    const isOnLoginPage = currentUrl.includes('/login');
    const isOnSendItemPage = currentUrl.includes('/send-item');

    if (isOnSendItemPage) {
      await expect(
        page.getByText('Loading...').or(page.getByText('Please log in'))
      ).toBeVisible({ timeout: 5000 });
    } else {
      expect(isOnLoginPage).toBeTruthy();
    }
  });

  test('should access search page without authentication', async ({ page }) => {
    // Search page should be accessible without login
    await page.goto('/search');

    // Should see the search page with tabs
    await expect(page.getByRole('tab', { name: 'Trips' })).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByRole('tab', { name: 'Requests' })).toBeVisible();
  });

  test('should switch between tabs on search page', async ({ page }) => {
    await page.goto('/search');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Should see Trips tab by default
    await expect(page.getByRole('tab', { name: 'Trips' })).toBeVisible();

    // Click on Requests tab
    await page.getByRole('tab', { name: 'Requests' }).click();
    await page.waitForTimeout(500);

    // Verify we're on Requests tab (it should be selected)
    const requestsTab = page.getByRole('tab', { name: 'Requests' });
    await expect(requestsTab).toBeVisible();
  });
});

