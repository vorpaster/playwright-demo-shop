import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the SauceDemo login page.
 *
 * Encapsulates all selectors and actions related to authentication.
 * Tests interact with this class, not with raw locators — so a selector
 * change only needs to be fixed here, not across every test file.
 */
export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectErrorMessage(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }

  async expectRedirectToInventory(): Promise<void> {
    await expect(this.page).toHaveURL(/.*inventory/);
  }
}
