/* eslint-disable playwright/expect-expect */
import { test } from '../fixtures/bookingFixture';

test.describe('Unhappy Path - Invalid Voucher', { tag: '@smoke' }, () => {
  test('Attempt to use invalid voucher code at checkout', async ({
    bookingUrl,
    homePage,
    orderPage,
    accommodationPage,
    reservationPage,
  }) => {
    await test.step('Navigate to reservation from homepage', async () => {
      await homePage.goto();
      await homePage.waitForPageLoad();
      await homePage.clickAccommodationReservation();
    });

    await test.step('Fill room link from Booking and check availability', async () => {
      await orderPage.waitForPageLoad();
      await orderPage.fillBookingUrl(bookingUrl);
      await orderPage.checkAvailability();
    });

    await test.step('Select room', async () => {
      await accommodationPage.waitForPageLoad();
      await accommodationPage.selectRoom(1);
      await accommodationPage.assertContinueButtonEnabled();
      await accommodationPage.continueToDetails();
    });

    await test.step('Fill guest details', async () => {
      await reservationPage.waitForPageLoad();

      // Fill all guest details
      await reservationPage.fillGuestDetails({
        firstName: 'Test',
        lastName: 'User',
        email: 'test-invalid-voucher@example.com',
        phone: '+420 777 888 999',
        street: 'Test Street',
        houseNumber: '1',
        postalCode: '11000',
        city: 'Prague',
      });
    });

    await test.step('Enter invalid voucher code', async () => {
      // Click 'Insert discount/gift voucher' button
      await reservationPage.insertAndApplyVoucher('INVALID-CODE');
    });

    await test.step('Verify error message for invalid voucher', async () => {
      // System validates the voucher and displays error
      await reservationPage.assertVoucherAppliedUnsuccessfully();
    });

    await test.step('Verify Reserve and Pay button remains enabled', async () => {
      // User can still proceed with booking without voucher
      await reservationPage.assertReserveButtonEnabled();
    });
  });
});
