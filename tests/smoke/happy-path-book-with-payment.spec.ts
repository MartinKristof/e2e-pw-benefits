// spec: specs/test-plan.md
// seed: tests/seed.spec.ts
// pom: tests/pages/HomePage.ts, tests/pages/OrderPage.ts, tests/pages/ReservationPage.ts, tests/pages/StatusPage.ts

import { paymentMethods } from '../../playwright.config';
import { test, expect } from '../fixtures/bookingFixture';

test.describe('Happy Path', () => {
  // Parametrize test for each available payment method
  // paymentMethods fixture contains:
  // CZ: ['pluxee-benefit-card', 'bank-transfer', 'voucher']
  // PL: ['bank-transfer', 'voucher']
  // Whitelabel: Full set of payment methods

  const allPaymentMethods = paymentMethods;

  allPaymentMethods.forEach((method) => {
    test(`Book accommodation with ${method} payment`, async ({
      page,
      bookingUrl,
      paymentMethods,
      homePage,
      orderPage,
      accommodationPage,
      reservationPage,
      statusPage,
      validVoucherCode
    }) => {
      // Skip if this payment method is not available in this project variant
      if (!paymentMethods.includes(method)) {
        test.skip();
      }

      // Navigate to staging homepage
      await homePage.goto();

      await homePage.waitForPageLoad();

      // Click 'Accommodation reservation' link in navigation
      // await homePage.clickAccommodationReservation();
      // await page.waitForURL('**/order');

      // Enter a valid Booking.com hotel link (from fixture)
      // await orderPage.waitForPageLoad();
      // await orderPage.fillBookingUrl(bookingUrl);

      // Availability check completes
      // await orderPage.checkAvailability();

      // Select 1 room from available options
      await page.goto(
        'https://test-fe-cz.dovolena-za-benefity.cz/objednavka/ubytovani/4502f49b-469a-42ff-94dd-68e462c8c22c'
      );
      await accommodationPage.waitForPageLoad();
      await accommodationPage.selectRoom(1);

      // Click 'Continue to details' button
      await accommodationPage.continueToDetails();

      await reservationPage.waitForPageLoad();
      // Fill all guest details (first name, last name, email, phone, street, house number, postal code, city)
      await reservationPage.fillGuestDetails({
        firstName: 'Test',
        lastName: 'User',
        email: `test-${method}@example.com`,
        phone: '+420 777 888 999',
        street: 'Test Street',
        houseNumber: '1',
        postalCode: '11000',
        city: 'Prague',
      });

      // If payment method is voucher: Apply valid voucher code
      // TODO: solve better
      if (method === 'voucher') {
        await reservationPage.insertAndApplyVoucher(validVoucherCode);
      }

      // Select the configured payment method from available options
      await reservationPage.selectPaymentMethod(method);

      // Check all required checkboxes (cancellation policy, terms and conditions)
      await reservationPage.checkAllRequiredTerms();

      // Verify 'Reserve and pay' button is enabled
      await reservationPage.assertReserveButtonEnabled();

      // Get pricing information for verification
      await reservationPage.assertTotalPrice();

      // Click 'Reserve and pay' button
      await reservationPage.submitReservation();

      // Verify status page displays reservation confirmation
      await statusPage.waitForPageLoad();

      await statusPage.assertReservationConfirmation();
    });
  });
});
