/* eslint-disable playwright/no-skipped-test */
/* eslint-disable playwright/expect-expect */
import { test } from '../fixtures/bookingFixture';
import { getAllPaymentMethods } from '../lib/paymentMethods';

const availablePaymentMethods = getAllPaymentMethods();

test.describe('Happy Path', { tag: '@smoke' }, () => {
  // Parametrize test for each available payment method

  availablePaymentMethods.forEach((method) => {
    test(`Book accommodation with ${method} payment`, async ({
      bookingUrl,
      paymentMethods,
      homePage,
      orderPage,
      accommodationPage,
      reservationPage,
      statusPage,
      validVoucherCode,
    }) => {
      // Skip if this payment method is not available in this project variant
      test.skip(
        !paymentMethods.includes(method),
        `Payment method ${method} not available in this project`
      );

      await test.step('Navigate to reservation from homepage', async () => {
        await homePage.goto();
        await homePage.waitForPageLoad();
        await homePage.clickAccommodationReservation();
      });

      await test.step('Fill room link from Booking and check availability', async () => {
        // await orderPage.goto();
        // Enter a valid Booking.com hotel link (from fixture)
        await orderPage.waitForPageLoad();
        await orderPage.fillBookingUrl(bookingUrl);
        // Availability check completes
        await orderPage.checkAvailability();
      });

      await test.step('Select room', async () => {
        // Select 1 room from available options
        await accommodationPage.waitForPageLoad();
        await accommodationPage.selectRoom(1);

        await accommodationPage.assertContinueButtonEnabled();
        // Click 'Continue to details' button
        await accommodationPage.continueToDetails();
      });

      await test.step('Fill reservation details', async () => {
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

        // Apply voucher if payment method is voucher
        await reservationPage.applyVoucherIfNeeded(method, validVoucherCode);
      });

      await test.step('Select payment method, verify and complete reservation', async () => {
        // Select the configured payment method from available options
        await reservationPage.selectPaymentMethod(method);

        // Check all required checkboxes (cancellation policy, terms and conditions)
        await reservationPage.checkAllRequiredTerms();

        // Verify 'Reserve and pay' button is enabled
        await reservationPage.assertReserveButtonEnabled();

        // Click 'Reserve and pay' button
        await reservationPage.submitReservation();
      });

      await test.step('Complete payment and verify confirmation', async () => {
        // Verify status page displays reservation confirmation
        await statusPage.waitForPageLoad();
        await statusPage.assertReservationConfirmation();
      });
    });
  });
});
