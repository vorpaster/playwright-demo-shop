import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { USERS, MESSAGES } from '../utils/test-data';

/**
 * TC1 — Login scenarios
 *
 * Covers three distinct authentication paths:
 *   1. Happy path — valid credentials redirect to inventory
 *   2. Invalid credentials — clear error message shown, no redirect
 *   3. Locked-out user — specific error message distinguishable from generic auth error
 *
 * Why these three? They map to the three realistic user states that affect the
 * product experience. A locked-out user getting a generic "wrong password" error
 * is a UX and support burden — the error messages are tested as distinct.
 */
test.describe('Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TC1-01 | Valid credentials redirect to inventory page', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(USERS.standard.username, USERS.standard.password);

    await loginPage.expectRedirectToInventory();
    await inventoryPage.expectPageLoaded();
  });

  test('TC1-02 | Invalid credentials show an error message — no redirect', async ({ page }) => {
    await loginPage.login(USERS.invalid.username, USERS.invalid.password);

    await loginPage.expectErrorMessage(MESSAGES.loginError);
    // Confirm user stayed on the login page
    await expect(page).toHaveURL('/');
  });

  test('TC1-03 | Locked-out user sees a specific locked-out error', async ({ page }) => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);

    // Distinct from the generic auth error — important for support triage
    await loginPage.expectErrorMessage(MESSAGES.lockedOutError);
    await expect(page).toHaveURL('/');
  });
});
