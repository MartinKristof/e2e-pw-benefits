/* eslint-disable playwright/expect-expect */
import { test } from '../fixtures/bookingFixture';

test.describe('Unhappy Path - Invalid Room Count', { tag: '@smoke' }, () => {
  test('Attempt to select more rooms than number of adults', async ({
    bookingUrl,
    homePage,
    orderPage,
    accommodationPage,
  }) => {
    await test.step('Navigate to reservation from homepage', async () => {
      await homePage.goto();
      await homePage.waitForPageLoad();
      await homePage.clickAccommodationReservation();
    });

    await test.step('Enter valid Booking.com hotel link with 2 adults', async () => {
      await orderPage.waitForPageLoad();
      // Fill in the booking URL (configured for 2 adults in fixture)
      await orderPage.fillBookingUrl(bookingUrl);
      // Trigger availability check
      await orderPage.checkAvailability();
    });

    await test.step('Attempt to select more rooms than allowed and submit', async () => {
      // Wait for accommodation page to load
      await accommodationPage.waitForPageLoad();

      // For 1 adult, trying to select 2 rooms should fail
      await accommodationPage.selectRoom(1, 0);
      await accommodationPage.selectRoom(1, 1);

      await accommodationPage.continueToDetails();
    });

    await test.step('Verify validation error or constraint message appears', async () => {
      // Verify error message is displayed
      await accommodationPage.assertInvalidRoomCountError();
    });
  });
});
