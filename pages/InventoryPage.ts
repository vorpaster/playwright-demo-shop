import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the inventory (product listing) page.
 *
 * Responsible for product interactions: adding/removing items from cart,
 * reading the cart badge counter, and navigating to the cart.
 */
export class InventoryPage {
  private readonly cartBadge: Locator;
  private readonly cartIcon: Locator;
  private readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon  = page.locator('.shopping_cart_link');
    this.pageTitle = page.locator('.title');
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
  }

  /**
   * Adds an item to the cart by its product name.
   * Converts the product name to the data-test attribute format used by SauceDemo.
   * Example: "Sauce Labs Backpack" → "add-to-cart-sauce-labs-backpack"
   */
  async addItemToCart(productName: string): Promise<void> {
    const buttonId = `add-to-cart-${productName.toLowerCase().replace(/ /g, '-')}`;
    await this.page.locator(`[data-test="${buttonId}"]`).click();
  }

  async removeItemFromCart(productName: string): Promise<void> {
    const buttonId = `remove-${productName.toLowerCase().replace(/ /g, '-')}`;
    await this.page.locator(`[data-test="${buttonId}"]`).click();
  }

  async expectCartCount(expectedCount: number): Promise<void> {
    if (expectedCount === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      await expect(this.cartBadge).toHaveText(String(expectedCount));
    }
  }

  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }
}
