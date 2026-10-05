import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the shopping cart page.
 *
 * Validates cart contents and navigates to checkout.
 */
export class CartPage {
  private readonly checkoutButton: Locator;
  private readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems      = page.locator('.cart_item');
  }

  async expectItemInCart(productName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name').filter({ hasText: productName })
    ).toBeVisible();
  }

  async expectItemCount(expectedCount: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expectedCount);
  }

  async expectItemNotInCart(productName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name').filter({ hasText: productName })
    ).not.toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/.*checkout-step-one/);
  }
}
