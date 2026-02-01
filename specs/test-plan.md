# Dovolená za Benefity - Test Plan

## Application Overview

Automated test plan for Dovolená za Benefity accommodation booking platform. Tests are language-agnostic and cover happy path scenarios (booking with available payment methods per project variant) and unhappy path scenarios (invalid products, invalid inputs, invalid vouchers). The application supports multiple variants (CZ with Pluxee, PL without Pluxee, etc.) configured in `playwright.config.ts`. Tests validate the complete booking workflow ending with a reservation status page, stopping before final payment submission.

## Test Scenarios

### 1. Happy Path - Book accommodation with available payment method

**Seed:** `tests/seed.spec.ts`

**Parametrization:** This scenario is executed multiple times, once for each payment method configured in the project's `paymentMethods` array (read from `playwright.config.ts`).

**Configuration Reference:**
- CZ project: `paymentMethods: ['pluxee-benefit-card', 'bank-transfer', 'voucher']`
- PL project: `paymentMethods: ['bank-transfer', 'voucher']` (no Pluxee)
- Whitelabel: Full set of payment methods
- Test is parametrized via `.forEach(method => ...)` loop over available payment methods

#### 1.1. Book accommodation with available payment method

**File:** `tests/smoke/happy-path-book-with-payment.spec.ts`

**Steps:**
  1. Navigate to staging homepage
    - expect: Homepage loads successfully with 'Book accommodation' button visible
  2. Click 'Accommodation reservation' link in navigation
    - expect: Navigate to order page with booking URL input field
  3. Enter a valid Booking.com hotel link
    - expect: API call triggered automatically
    - expect: Availability check completes
    - expect: Page navigates to accommodation selection
  4. Select 1 room from available options
    - expect: Room selection updates with price
    - expect: Summary sidebar shows accommodation details and pricing
    - expect: 'Continue to details' button becomes enabled
  5. Click 'Continue to details' button
    - expect: Navigate to reservation form page
    - expect: Guest details form is displayed
  6. Fill all guest details (first name, last name, email, phone, street, house number, postal code, city)
    - expect: All fields accept input without errors
    - expect: Form fields are populated correctly
  7. Scroll to payment section
    - expect: Payment method section becomes visible
  8. If payment method is voucher: Apply valid voucher code
    - expect: Voucher input field appears when clicking 'Insert discount/gift voucher'
    - expect: Voucher is accepted (no error message)
    - expect: Price may be updated to reflect discount
  9. Select the configured payment method from available options
    - expect: Payment method is available and selectable
    - expect: Payment method is selected
  10. Check all required checkboxes (cancellation policy, terms and conditions)
    - expect: All required checkboxes are checked
  11. Verify 'Reserve and pay' button is enabled
    - expect: Button is in enabled state
    - expect: Button is clickable
  12. Click 'Reserve and pay' button
    - expect: Reservation is created successfully
    - expect: Page navigates to status page with URL pattern: /*/status/{uuid}
  13. Verify status page displays reservation confirmation
    - expect: Status page shows booking confirmation
    - expect: Reservation number is displayed
    - expect: No payment processing is triggered (test stops before final payment)

### 2. Unhappy Path - Cannot Book Online

**Seed:** `tests/seed.spec.ts`

#### 2.1. Attempt to book accommodation that cannot be paid online

**File:** `tests/smoke/unhappy-path-cannot-book-online.spec.ts`

**Steps:**
  1. Navigate to order page
    - expect: Order page loads with booking URL input
  2. Enter Booking.com link that cannot be booked online (https://www.booking.com/Share-FY8kPf)
    - expect: API processes the request
  3. Wait for availability check result
    - expect: System displays error message indicating accommodation cannot be paid online
    - expect: Error message is user-friendly and explains why booking is not possible
    - expect: Booking link is invalid or accommodation is not available for online payment

### 3. Unhappy Path - Invalid Room Count

**Seed:** `tests/seed.spec.ts`

#### 3.1. Attempt to book more rooms than number of adults

**File:** `tests/smoke/unhappy-path-invalid-room-count.spec.ts`

**Steps:**
  1. Navigate to order page
    - expect: Order page is ready
  2. Enter valid Booking.com hotel link with 2 adults
    - expect: Accommodation selection page displays rooms for 2 adults
  3. Attempt to select more rooms than allowed (e.g., 3 rooms for 2 adults)
    - expect: System prevents selection of invalid room quantity
    - expect: Validation message appears explaining the constraint
    - expect: Cannot proceed with invalid room count

### 4. Unhappy Path - Invalid Voucher

**Seed:** `tests/seed.spec.ts`

#### 4.1. Attempt to use invalid voucher code at checkout

**File:** `tests/smoke/unhappy-path-invalid-voucher.spec.ts`

**Steps:**
  1. Navigate through booking flow: homepage → order page → select accommodation → select room → continue to reservation
    - expect: Reach reservation form successfully
  2. Fill guest details
    - expect: All guest information is entered
  3. Click 'Insert discount/gift voucher' button
    - expect: Voucher input field appears
  4. Enter invalid/non-existent voucher code (e.g., 'INVALID_CODE_12345')
    - expect: Voucher code is entered
  5. Click 'Apply' button
    - expect: System validates the voucher
    - expect: Error message appears: 'Coupon INVALID_CODE_12345 is not valid'
    - expect: Voucher is rejected and not applied
    - expect: Pricing remains unchanged without discount
  6. Verify 'Reserve and pay' button remains available despite invalid voucher
    - expect: Button is still enabled
    - expect: User can proceed with booking without voucher
