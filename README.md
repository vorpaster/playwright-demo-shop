# playwright-demo-shop

> Playwright + TypeScript E2E test suite for [saucedemo.com](https://www.saucedemo.com) — a demo e-commerce application used to practice and showcase test automation.

[![Playwright Tests](https://github.com/<your-username>/playwright-demo-shop/actions/workflows/playwright.yml/badge.svg)](https://github.com/<your-username>/playwright-demo-shop/actions)

---

## What is being tested?

**SauceDemo** is a publicly available demo webshop that simulates a real e-commerce experience. This suite covers the three most business-critical user journeys:

| Suite | File | Scenarios |
|---|---|---|
| 🔐 Authentication | `tests/login.spec.ts` | Valid login, invalid credentials, locked-out user |
| 🛒 Shopping Cart | `tests/cart.spec.ts` | Add item, add multiple items, remove item |
| ✅ Checkout | `tests/checkout.spec.ts` | Full checkout flow, order summary data integrity |

**Total: 8 test scenarios**

---

## Design pattern — Page Object Model (POM)

All locators and page interactions are encapsulated in the `pages/` folder. Tests never reference raw CSS selectors directly — they call readable methods like `loginPage.login(...)` or `cartPage.expectItemInCart(...)`.

**Why POM?** If a selector changes in the app, you fix it in one place — not across every test file.

```
playwright-demo-shop/
├── tests/                   # Test specs — one file per feature
│   ├── login.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── pages/                   # Page Objects — encapsulate UI interactions
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── utils/
│   └── test-data.ts         # Centralised test data and constants
├── .env.example             # Template for environment variables
├── .github/
│   └── workflows/
│       └── playwright.yml   # CI pipeline — runs on every push
└── playwright.config.ts
```

---

## Setup

### Prerequisites
- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/<your-username>/playwright-demo-shop.git
cd playwright-demo-shop
npm install
npx playwright install chromium
```

### Environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

> ⚠️ **Never commit `.env` to git.** It is listed in `.gitignore`. Use `.env.example` as the template.

For SauceDemo the credentials are publicly documented, but the `.env` pattern is shown here as best practice for projects with real secrets.

---

## Running the tests

```bash
# Run all tests (headless — fastest)
npm test

# Run with the browser visible
npm run test:headed

# Interactive UI mode — great for debugging and writing new tests
npm run test:ui

# Open the HTML report after a run
npm run test:report
```

---

## CI / CD — GitHub Actions

Tests run automatically in the cloud on **every push** to `main` and `develop`, and on every **pull request** to `main`.

The full HTML report is uploaded as a GitHub Actions artifact and kept for **14 days** — so you can investigate any failure without needing to re-run locally.

See: [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)

---

## Key design decisions

**Retries on CI only** — `retries: 2` activates only when `CI=true`. Locally, retries would mask real flakiness that should be investigated, not hidden.

**Independent test state** — Each test sets up its own state in `beforeEach` rather than sharing a logged-in session. Slower, but failures are fully isolated and easier to debug.

**One assertion per logical check** — Each `expect()` tests exactly one thing. Failure messages tell you precisely what broke.

**Chromium only** — Firefox and WebKit would be added in a real project. For this assignment, Chromium covers all scenarios.
