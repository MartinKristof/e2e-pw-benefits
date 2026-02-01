# Dovolená za Benefity - Test Plan - CZ & PL Staging

## Application Overview

The "Dovolená za Benefity" application allows employees to purchase accommodation using their employee benefits. It is a multiproduct application with multiple variants: CZ (https://test-fe-cz.dovolena-za-benefity.cz) with Pluxee payment option, and PL (https://test-fe-pl.dovolena-za-benefity.cz) without Pluxee. Users copy a link from Booking.com, select rooms, fill in their details, and choose a combination of payment methods (Edenred, Pluxee for CZ only, UP, Bank Transfer, Payment Card).

## Test Scenarios

### 1. Happy Path - CZ - Voucher Payment

**Seed:** `tests/seed.spec.ts`

#### 1.1. Purchase accommodation with voucher payment - CZ staging

**File:** `tests/happy-path/cz/booking-with-voucher.spec.ts`

**Steps:**
  1. Visit https://test-fe-cz.dovolena-za-benefity.cz/cz-en
    - expect: Application loads and displays homepage with navigation
  2. Click on 'Accommodation reservation' in the navigation
    - expect: Form for entering booking.com link is displayed
  3. Enter booking.com URL into the field 'Paste the hotel link from Booking.com'
    - expect: URL is entered into the field without errors
  4. Click 'Check availability'
    - expect: API returns available rooms with prices
    - expect: Form changes to room selection
  5. Select 1 room (click 'Choose a room' and select quantity)
    - expect: Room is recorded as selected
    - expect: Summary is updated with price
  6. Click 'Continue to details'
    - expect: Guest details form is displayed
  7. Fill in: First name, Last name, Email, Phone, Street, House number, Postal code, City
    - expect: All required fields are filled without errors
  8. Scroll down to Payment section
    - expect: Voucher button is visible and active
  9. Click 'Insert discount/gift voucher'
    - expect: Voucher modal opens
    - expect: Field for voucher code is accessible
  10. Enter valid voucher code and confirm
    - expect: Voucher is applied
    - expect: Price is reduced by voucher value
  11. Check 'I agree to cancellation policy' and 'I agree to business terms'
    - expect: Both checkboxes 'Agree to terms' are checked
    - expect: Button 'Reserve and pay' is active
  12. STOP - Do not submit! Close page without finalizing the order
    - expect: Test does not proceed - API call is not finalized without final submission

### 2. Happy Path - CZ - Pluxee Payment

**Seed:** `tests/seed.spec.ts`

#### 2.1. Purchase accommodation with Pluxee payment - CZ staging (CZ ONLY)

**File:** `tests/happy-path/cz/booking-with-pluxee.spec.ts`

**Steps:**
  1. Visit https://test-fe-cz.dovolena-za-benefity.cz/cz-en
    - expect: Application loads
  2. Navigate to /cz-en/order or click 'Accommodation reservation'
    - expect: Booking form is prepared
  3. Enter booking.com URL and click 'Check availability'
    - expect: Rooms load
  4. Select room and proceed to details
    - expect: Room is selected
  5. Fill all required fields: name, email, phone, address
    - expect: Guest form is filled
  6. Click 'Add payment' in Payment section and select 'Pluxee Benefit Card'
    - expect: Pluxee appears as payment option
  7. Verify that Pluxee is selected in dropdown under 'I want to pay'
    - expect: Pluxee is selected and price is correct
  8. Check required terms and conditions
    - expect: Both checkboxes are checked
    - expect: Button is active
  9. STOP - Do not submit the order. Close without finalization.
    - expect: Test does not proceed without final submission

### 3. Happy Path - CZ - Bank Transfer Payment

**Seed:** `tests/seed.spec.ts`

#### 3.1. Purchase accommodation with bank transfer payment - CZ staging

**File:** `tests/happy-path/cz/booking-with-bank-transfer.spec.ts`

**Steps:**
  1. Visit https://test-fe-cz.dovolena-za-benefity.cz/cz-en
    - expect: Application loads
  2. Navigate to /cz-en/order
    - expect: Order page is prepared
  3. Enter booking URL and check availability
    - expect: Rooms are visible
  4. Select room and proceed to details
    - expect: Summary is displayed
  5. Fill required guest information
    - expect: Guest data is filled
  6. Click 'Add payment' and select 'Bank Transfer'
    - expect: Bank Transfer is shown in options
  7. Verify that Bank Transfer appears in payment summary
    - expect: IBAN and other details are displayed on summary screen
  8. Check both required checkboxes
    - expect: Terms are checked
  9. Do not submit. Close without payment.
    - expect: STOP - without finalizing the order

### 4. Happy Path - CZ - Split Payment (Voucher + Bank Transfer)

**Seed:** `tests/seed.spec.ts`

#### 4.1. Purchase with split payment - voucher + bank transfer - CZ staging

**File:** `tests/happy-path/cz/booking-with-split-payment.spec.ts`

**Steps:**
  1. Visit https://test-fe-cz.dovolena-za-benefity.cz/cz-en
    - expect: Application is loaded
  2. Navigate to booking form
    - expect: Order form is displayed
  3. Enter booking URL, check availability, select room, fill host data
    - expect: Rooms and details are visible
  4. In Payment section: Click 'Add payment' to add second payment method
    - expect: Second payment method is displayed
  5. Add Voucher as first payment method and enter code
    - expect: Voucher is applied
    - expect: Remainder is prepared for second payment method
  6. Select 'Bank Transfer' as second payment method
    - expect: Bank Transfer is displayed as second payment method
  7. Verify Payment summary - should show Voucher + Bank Transfer
    - expect: Summary shows both methods and their amounts
  8. Check required terms
    - expect: Terms are confirmed
  9. Do not submit - close without finalization
    - expect: STOP without submission

### 5. Happy Path - PL - Voucher Payment (No Pluxee)

**Seed:** `tests/seed.spec.ts`

#### 5.1. Purchase accommodation with voucher payment - PL staging (NO PLUXEE)

**File:** `tests/happy-path/pl/booking-with-voucher.spec.ts`

**Steps:**
  1. Visit https://test-fe-pl.dovolena-za-benefity.cz/pl-en
    - expect: Application loads and displays homepage with navigation
  2. Click on 'Accommodation reservation' in the navigation
    - expect: Form for entering booking.com link is displayed
  3. Enter booking.com URL into the field 'Paste the hotel link from Booking.com'
    - expect: URL is entered into the field without errors
  4. Click 'Check availability'
    - expect: API returns available rooms with prices
    - expect: Form changes to room selection
  5. Select 1 room (click 'Choose a room' and select quantity)
    - expect: Room is recorded as selected
    - expect: Summary is updated with price
  6. Click 'Continue to details'
    - expect: Guest details form is displayed
  7. Fill in: First name, Last name, Email, Phone, Street, House number, Postal code, City
    - expect: All required fields are filled without errors
  8. Scroll down to Payment section
    - expect: Voucher button is visible and active
  9. Click 'Insert discount/gift voucher'
    - expect: Voucher modal opens
    - expect: Field for voucher code is accessible
  10. Enter valid voucher code and confirm
    - expect: Voucher is applied
    - expect: Price is reduced by voucher value
  11. Check 'I agree to cancellation policy' and 'I agree to business terms'
    - expect: Both checkboxes 'Agree to terms' are checked
    - expect: Button 'Reserve and pay' is active
  12. STOP - Do not submit! Close page without finalizing the order
    - expect: Test does not proceed - API call is not finalized without final submission

### 6. Happy Path - PL - Bank Transfer Payment (No Pluxee)

**Seed:** `tests/seed.spec.ts`

#### 6.1. Purchase accommodation with bank transfer payment - PL staging (NO PLUXEE)

**File:** `tests/happy-path/pl/booking-with-bank-transfer.spec.ts`

**Steps:**
  1. Visit https://test-fe-pl.dovolena-za-benefity.cz/pl-en
    - expect: Application loads
  2. Navigate to /pl-en/order
    - expect: Order page is prepared
  3. Enter booking URL and check availability
    - expect: Rooms are visible
  4. Select room and proceed to details
    - expect: Summary is displayed
  5. Fill required guest information
    - expect: Guest data is filled
  6. Click 'Add payment' and select 'Bank Transfer'
    - expect: Bank Transfer is shown in options
  7. Verify that Bank Transfer appears in payment summary
    - expect: IBAN and other details are displayed on summary screen
  8. Verify that 'Pluxee Benefit Card' is not in the payment method dropdown
    - expect: Pluxee is NOT available as payment option
  9. Check both required checkboxes
    - expect: Terms are checked
  10. Do not submit. Close without payment.
    - expect: STOP - without finalizing the order

### 7. Happy Path - PL - Split Payment (Voucher + Bank Transfer, No Pluxee)

**Seed:** `tests/seed.spec.ts`

#### 7.1. Purchase with split payment - voucher + bank transfer - PL staging (NO PLUXEE)

**File:** `tests/happy-path/pl/booking-with-split-payment.spec.ts`

**Steps:**
  1. Visit https://test-fe-pl.dovolena-za-benefity.cz/pl-en
    - expect: Application is loaded
  2. Navigate to booking form
    - expect: Order form is displayed
  3. Enter booking URL, check availability, select room, fill host data
    - expect: Rooms and details are visible
  4. In Payment section: Click 'Add payment' to add second payment method
    - expect: Second payment method is displayed
  5. Add Voucher as first payment method and enter code
    - expect: Voucher is applied
    - expect: Remainder is prepared for second payment method
  6. Select 'Bank Transfer' as second payment method
    - expect: Bank Transfer is displayed as second payment method
  7. Verify that when selecting payment methods, Pluxee is not listed
    - expect: Pluxee is NOT available as option in payment method dropdown
  8. Verify Payment summary - should show Voucher + Bank Transfer ONLY
    - expect: Summary shows both methods (Voucher + Bank Transfer) and their amounts
  9. Check required terms
    - expect: Terms are confirmed
  10. Do not submit - close without finalization
    - expect: STOP without submission

### 8. Unhappy Path - Product Not Available Online

**Seed:** `tests/seed.spec.ts`

#### 8.1. Attempt to purchase product that cannot be purchased online

**File:** `tests/unhappy-path/product-not-available-online.spec.ts`

**Steps:**
  1. Visit https://test-fe-cz.dovolena-za-benefity.cz/cz-en/order
    - expect: Order form is displayed
  2. Enter URL of product that cannot be purchased online: https://www.booking.com/Share-FY8kPf
    - expect: URL is entered
  3. Click 'Check availability'
    - expect: API determines it cannot be purchased online
    - expect: Error message is displayed: 'This accommodation cannot be purchased online' or similar
  4. Verify that error message is displayed
    - expect: Form is reset or shows error
    - expect: User is prompted to select different hotel

### 9. Unhappy Path - More Rooms Than Adults

**Seed:** `tests/seed.spec.ts`

#### 9.1. Attempt to select more rooms than number of adults

**File:** `tests/unhappy-path/more-rooms-than-adults.spec.ts`

**Steps:**
  1. Enter valid booking URL (with 2 adults) and check availability
    - expect: Available rooms load
  2. Verify URL parameters
    - expect: URL specifies 2 adults (group_adults=2)
  3. Attempt to select 3 rooms (more than number of adults)
    - expect: System should prevent selection of 3+ rooms
    - expect: Warning message is displayed
  4. Verify that cannot proceed with invalid number of rooms
    - expect: Button 'Continue to details' is disabled or error message is displayed
  5. Select 2 rooms and verify that can proceed
    - expect: After selecting 2 rooms, button is activated again

### 10. Unhappy Path - Invalid Voucher Code

**Seed:** `tests/seed.spec.ts`

#### 10.1. Attempt to use invalid voucher code

**File:** `tests/unhappy-path/invalid-voucher.spec.ts`

**Steps:**
  1. Proceed to payment form (without voucher)
    - expect: Host details and payment section are prepared
  2. Click 'Insert discount/gift voucher'
    - expect: Voucher modal opens
  3. Enter invalid voucher code (e.g., 'INVALID123')
    - expect: Code is entered
  4. Click button to apply/confirm voucher
    - expect: System attempts to validate voucher
    - expect: Error message is displayed: 'Invalid voucher code' or 'Voucher not found'
  5. Verify that voucher was not applied in summary and price is normal
    - expect: Voucher is not applied
    - expect: Price remains unchanged
  6. Enter valid voucher and verify that price is reduced
    - expect: After entering valid voucher, it is applied
