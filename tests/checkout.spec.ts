import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PRODUCTS, CHECKOUT, MESSAGES } from '../utils/test-data';

/**
 * TC3 — Checkout flow (end-to-end)
 *
 * This is the most critical user journey on the platform:
 * add item → cart → fill information → review order → confirm.
 *
 * A failure anywhere in this flow means zero revenue.
 * Covered scenarios:
 *   1. Complete happy-path checkout for a single item
 *   2. Order summary correctly reflects what was added (data integrity)
 *
 * Note: payment validation is out of scope — SauceDemo is a demo app
 * with no real payment processing.
 */
test.describe('Checkout Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage      = new CartPage(page);
    checkoutPage  = new CheckoutPage(page);

    // Arrange: logged-in user with one item in cart
    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectPageLoaded();
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.goToCart();
  });

  test('TC3-01 | Complete checkout shows order confirmation', async () => {
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInformation(
      CHECKOUT.firstName,
      CHECKOUT.lastName,
      CHECKOUT.postalCode
    );

    await checkoutPage.completeOrder();
    await checkoutPage.expectOrderConfirmation(MESSAGES.orderComplete);
  });

  test('TC3-02 | Order summary correctly reflects the added item', async () => {
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingInformation(
      CHECKOUT.firstName,
      CHECKOUT.lastName,
      CHECKOUT.postalCode
    );

    // Verify: summary shows exactly what we added, nothing more
    await checkoutPage.expectOrderSummaryContains(PRODUCTS.backpack);
    await checkoutPage.expectItemCountInSummary(1);
  });
});
