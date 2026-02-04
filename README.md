
# Dovolená za Benefity - Playwright E2E Tests

Automated E2E tests for the "Dovolená za Benefity" accommodation booking application. Tests cover happy path (successful bookings) and unhappy path (error scenarios) across multiple project variants (CZ, PL, Whitelabel).

## Project Structure

```
tests/
├── fixtures/              # Playwright fixtures and test configuration
│   └── bookingFixture.ts # Page Object instances and test data
├── pages/                 # Page Object Model classes
│   ├── HomePage.ts
│   ├── OrderPage.ts
│   ├── AccommodationPage.ts
│   ├── ReservationPage.ts
│   ├── StatusPage.ts
│   └── index.ts
├── components/           # Reusable components
│   ├── NavigationComponent.ts
│   └── PaymentMethodComponent.ts
├── lib/                  # Utility functions and constants
│   ├── routes.ts        # URL routes for different projects
│   └── paymentMethods.ts # Payment method constants
├── smoke/               # Smoke tests
│   ├── happy-path-book-with-payment.spec.ts
│   ├── unhappy-path-cannot-book-online.spec.ts
│   ├── unhappy-path-invalid-room-count.spec.ts
│   └── unhappy-path-invalid-voucher.spec.ts
└── setup/
    └── prepare-booking-urls.setup.ts

specs/
├── plan.md             # General test plan
└── test-plan.md        # Detailed test scenarios

playwright.config.ts    # Project configuration (cz, pl, whitelabel)
```

## Installation

### Prerequisites

- Node.js 20+
- npm

### Setup Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npm run playwright:install
   ```

## Running Tests

### Basic Commands

```bash
# Run all tests (default project - cz)
npm test

# Run with visible browser
npm run test:headed

# Interactive UI mode
npm run test:ui

# Show HTML report
npm run test:report
```

### Running Specific Projects

```bash
# CZ project only
npm run test:cz

# PL project only
npm run test:pl

# Whitelabel project only
npm run test:whitelabel

# All projects
npm run test:all-projects

# All projects with visible browser
npm run test:all-projects:headed
```

### Running Specific Tests

```bash
# By test name
npx playwright test -g "Book accommodation with pluxee-benefit-card"

# Specific file
npx playwright test tests/smoke/happy-path-book-with-payment.spec.ts

# With debugger
npx playwright test --debug
```

## Project Configuration

Projects are defined in `playwright.config.ts`:

- **cz**: Czech variant with Pluxee and other payment methods
- **pl**: Polish variant without Pluxee
- **whitelabel**: White label with full payment method support

Each project includes:
- Its own base URL
- Available payment methods configuration
- Valid voucher codes for testing

### Configuration Example

```typescript
// playwright.config.ts
const projects = [
  {
    name: 'cz',
    use: { 
      ...devices['Desktop Chrome'],
      baseURL: 'https://test-fe-cz.dovolena-za-benefity.cz',
      paymentMethods: ['pluxee-benefit-card', 'bank-transfer', 'voucher'],
      validVoucherCode: 'VALID-CODE-CZ-123'
    },
  },
  {
    name: 'pl',
    use: { 
      ...devices['Desktop Chrome'],
      baseURL: 'https://test-fe-pl.dovolena-za-benefity.cz',
      paymentMethods: ['bank-transfer', 'voucher'],  // No Pluxee in PL
      validVoucherCode: 'VALID-CODE-PL-456'
    },
  },
];
```

The configuration is used by tests via fixtures:
- `paymentMethods` array determines which payment scenarios are tested
- `validVoucherCode` is injected into tests that validate voucher functionality
- Tests automatically skip unavailable payment methods for each project variant

## Test Data & Valid Codes

### Czech (CZ) - Valid Voucher Codes
```
PVD13L7I
UCLDXUNY
TSS6H3RI
F50TYJFW
TIM91YX4
```

### Polish (PL) - Valid Voucher Codes
```
99Q272C7
CWJY25MX
GBJVU6GU
6BH6P57K
EDG9G9Z2
4CPG6FYH
6PPSGC9M
```

These codes can be used in tests by:
1. Configuring them in `playwright.config.ts` as `validVoucherCode`
2. They will be automatically injected via the `validVoucherCode` fixture
3. Tests like `unhappy-path-invalid-voucher.spec.ts` has hardcoded one

## Development

### Page Object Model (POM)

Tests follow POM pattern - each page has its own class:

```typescript
export class ReservationPage {
  constructor(page: Page, projectName: ProjectName) {
    this.firstNameInput = page.getByRole('textbox', { name: /Jméno|Imię/ });
    // ...
  }

  async fillGuestDetails(details: { ... }) {
    // ...
  }
}
```

### Semantic Selectors

Selectors are primarily semantic (getByRole) with CSS fallbacks:

```typescript
// Semantic selector - works across projects
this.button = page.getByRole('button', { name: /Pokračovat|Przejdź/i });

// CSS fallback - for complex cases
this.continueButton = page.locator('.order-summary__footer button')
  .or(page.getByRole('button', { name: /Pokračovat/ }));
```

### Writing a New Test

1. Create `.spec.ts` file in `tests/smoke/`
2. Import fixture:
   ```typescript
   import { test } from '../fixtures/bookingFixture';
   ```
3. Use POM classes from fixture:
   ```typescript
   test('My test', async ({ homePage, orderPage, reservationPage }) => {
     await homePage.goto();
     await homePage.waitForPageLoad();
     // ...
   });
   ```
4. Structure tests with `test.step()`:
   ```typescript
   await test.step('Description', async () => {
     // ...
   });
   ```

### Adding New Selectors

When selector is project-specific:

```typescript
// ReservationPage.ts
this.emailInput = page.getByRole('textbox', { name: /Emailová adresa|Adres e‑mail/ })
  .or(page.locator('#email')); // fallback
```

Multi-language regex:
```typescript
/Czech|Polish|English/i  // case-insensitive
```

## Code Quality

```bash
# Format code (Prettier)
npm run format

# Check format
npm run format:check

# ESLint (playwright rules)
npm run lint

# Fix lint errors
npm run lint:fix
```

## Test Scenarios

### 1. Happy Path - Successful Booking
- Flow: homepage → order page → room selection → guest details → payment selection → submission
- Parametrized for each available payment method
- File: `tests/smoke/happy-path-book-with-payment.spec.ts`

### 2. Unhappy Path - Cannot Book Online
- Attempts to book accommodation that cannot be paid online
- Validates error message: "Pokoj není možné zaplatit online"
- File: `tests/smoke/unhappy-path-cannot-book-online.spec.ts`

### 3. Unhappy Path - Invalid Room Count
- Attempts to select more rooms than adults
- Validates error message: "Počet dospělých nemůže být menší než počet produktů"
- File: `tests/smoke/unhappy-path-invalid-room-count.spec.ts`

### 4. Unhappy Path - Invalid Voucher
- Attempts to apply non-existent voucher code
- Validates error message and confirms ability to proceed without voucher
- File: `tests/smoke/unhappy-path-invalid-voucher.spec.ts`

## Debugging & Troubleshooting

### Playwright Inspector

Run tests with debugger:
```bash
npx playwright test --debug
```

### Trace Recording

Failed tests automatically save traces in `test-results/`

### Screenshots

Screenshots captured on failure in `test-results/`

### HTML Report

```bash
npm run test:report
```

## CI/CD Ready

Tests are configured for CI pipeline:
```bash
npm run test:all-projects
```

Proper exit codes for CI integration.

## Notes

- Tests use static booking URLs from fixture (reliability)
- Each test is isolated - no dependencies on previous tests
- test.step() improves organization and report readability
- WebFirst assertions ensure test stability
- Booking.com Genius popup is automatically handled

## Known Limitations

### Booking URL Verification
The application fixture includes automated booking URL extraction from Booking.com (see `bookingFixture.ts` - commented out code), which:
- Dynamically navigates Booking.com
- Searches for accommodations
- Extracts room booking URLs from detail pages

However, this approach is **not fully reliable** due to:
- Dynamic Booking.com page structure changes
- Network timeouts during browser automation
- Booking.com anti-automation detection

**Current Solution:** Tests use pre-configured static booking URLs from the fixture for stability. The dynamic extraction code is preserved in `bookingFixture.ts` for future enhancement if needed.

**Production improvements:**
- Implement retry logic with exponential backoff for dynamic URL extraction
- Use dedicated test booking accounts with pre-saved URLs
- Consider fetching from a test data service/API instead
- Monitor and update selectors when Booking.com structure changes

### Locator Strategy
Locators are based on semantic selectors (getByRole) and CSS classes without testId attributes because:
- Application does not use testId attributes in HTML
- CSS class names differ between project variants
- Required using regex patterns for multi-language support
- Vue locators (`page.locator('_vue=...')`) could not be used - work on dev build only

**Improvement opportunities:**
- Collaborate with development team to add testId attributes (`data-testid`)
- This would significantly improve selector stability and maintainability
- Would eliminate need for language-specific regex patterns
- Consider implementing Vue component testing if Vue structure becomes more accessible
- Add API for voucher creation and deletion

## AI Usage & Implementation

This project was developed in collaboration with an AI assistant (GitHub Copilot). The AI was utilized for:

- **Architectural design**: Multi-project configuration and POM pattern implementation
- **Fixture creation**: Dynamic test data and page object instantiation
- **Selector strategy**: Semantic selectors with language-agnostic regex patterns
- **Error handling**: Multi-language error message validation
- **Best practices guidance**: WebFirst assertions and test isolation
- **Playwright Agents**: Used MCP Playwright tools for interactive inspection of live project variants to identify working selectors across different HTML structures and generating tests

The AI proved invaluable in:
- Rapidly prototyping test structure
- Identifying semantic selector patterns that work across HTML variants
- Using Playwright Agents to navigate and inspect actual pages in different projects (CZ, PL, Whitelabel)
- Comparing HTML structures across variants to find universal selector patterns
- Refactoring from CSS-class-based selectors to role-based selectors
- Handling multi-language test assertions
- Organizing test code for maintainability
- Analyzing generated Playwright tests as reference implementations

## Reflection

Given more time, I would:

- **Implement visual regression testing** for cross-variant consistency validation
- **Add API testing layer** to verify backend responses alongside UI tests
- **Create test data management** - centralized test data factory for different booking scenarios
- **Enhance reporting** - custom HTML reports with screenshots and video recordings
- **Implement performance monitoring** - track page load times across variants and identify regressions
- **Expand reusable components** - create more shared component abstractions (e.g., FormComponent, ButtonComponent, ModalComponent) for better code reuse across different pages
- **Add mock/stub tests** - implement tests with mocked API responses to isolate UI testing from backend dependencies and increase test reliability
