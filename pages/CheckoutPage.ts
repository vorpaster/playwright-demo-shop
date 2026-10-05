import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object for the multi-step checkout flow.
 *
 * SauceDemo checkout has three steps:
 *   Step 1: Enter personal information
 *   Step 2: Order summary / overview
 *   Step 3: Order confirmation
 *
 * All three steps are handled here since they form a single user journey.
 */
export class CheckoutPage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly confirmationHeader: Locator;
  private readonly orderSummaryItems: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput    = page.locator('[data-test="firstName"]');
    this.lastNameInput     = page.locator('[data-test="lastName"]');
    this.postalCodeInput   = page.locator('[data-test="postalCode"]');
    this.continueButton    = page.locator('[data-test="continue"]');
    this.finishButton      = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.orderSummaryItems = page.locator('.cart_item');
  }

  async fillShippingInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/.*checkout-step-two/);
  }

  async expectOrderSummaryContains(productName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name').filter({ hasText: productName })
    ).toBeVisible();
  }

  async expectItemCountInSummary(count: number): Promise<void> {
    await expect(this.orderSummaryItems).toHaveCount(count);
  }

  async completeOrder(): Promise<void> {
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/.*checkout-complete/);
  }

  async expectOrderConfirmation(expectedMessage: string): Promise<void> {
    await expect(this.confirmationHeader).toHaveText(expectedMessage);
  }
}
