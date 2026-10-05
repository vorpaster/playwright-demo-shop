import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { USERS, PRODUCTS } from '../utils/test-data';

/**
 * TC2 — Shopping cart scenarios
 *
 * Covers the add-to-cart and cart management flow:
 *   1. Adding one item — cart badge reflects the change
 *   2. Adding multiple items — cart aggregates correctly
 *   3. Removing an item — cart updates and item is gone
 *
 * Each test logs in independently (no shared state between tests).
 * This is intentional: shared login state speeds up tests but makes
 * failures harder to isolate. For this suite, correctness > speed.
 */
test.describe('Shopping Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage     = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage      = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await inventoryPage.expectPageLoaded();
  });

  test('TC2-01 | Adding one item updates the cart badge to 1', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);

    await inventoryPage.expectCartCount(1);
  });

  test('TC2-02 | Adding two items shows both in the cart with correct count', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight);

    await inventoryPage.expectCartCount(2);

    await inventoryPage.goToCart();

    await cartPage.expectItemInCart(PRODUCTS.backpack);
    await cartPage.expectItemInCart(PRODUCTS.bikeLight);
    await cartPage.expectItemCount(2);
  });

  test('TC2-03 | Removing an item clears it from the cart', async () => {
    await inventoryPage.addItemToCart(PRODUCTS.backpack);
    await inventoryPage.addItemToCart(PRODUCTS.bikeLight);
    await inventoryPage.removeItemFromCart(PRODUCTS.backpack);

    await inventoryPage.expectCartCount(1);

    await inventoryPage.goToCart();

    await cartPage.expectItemNotInCart(PRODUCTS.backpack);
    await cartPage.expectItemInCart(PRODUCTS.bikeLight);
    await cartPage.expectItemCount(1);
  });
});
