/**
 * Centralised test data.
 *
 * Credentials are read from environment variables so they are never
 * hard-coded or committed to the repository.
 *
 * For local development: copy .env.example to .env and fill in the values.
 * On CI: set the variables in GitHub Actions secrets / environment settings.
 *
 * SauceDemo uses publicly documented test accounts, but this pattern is
 * shown as best practice for any project with real secrets.
 */

const TEST_PASSWORD = process.env.TEST_PASSWORD ?? 'secret_sauce';

export const USERS = {
  /** Standard user — full happy-path access */
  standard: {
    username: process.env.STANDARD_USER ?? 'standard_user',
    password: TEST_PASSWORD,
  },
  /** Locked-out user — should see a specific error on login */
  lockedOut: {
    username: process.env.LOCKED_OUT_USER ?? 'locked_out_user',
    password: TEST_PASSWORD,
  },
  /** Invalid credentials — does not exist in the system */
  invalid: {
    username: 'nonexistent_user',
    password: 'wrong_password',
  },
} as const;

export const CHECKOUT = {
  firstName: 'Test',
  lastName:  'User',
  postalCode: '12345',
} as const;

export const PRODUCTS = {
  backpack:  'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
} as const;

export const MESSAGES = {
  loginError:    'Epic sadface: Username and password do not match any user in this service',
  lockedOutError: 'Epic sadface: Sorry, this user has been locked out.',
  orderComplete:  'Thank you for your order!',
} as const;
