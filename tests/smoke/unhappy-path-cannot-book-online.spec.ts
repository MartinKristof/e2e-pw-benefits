/* eslint-disable playwright/expect-expect */
import { test } from '../fixtures/bookingFixture';

// Override booking URL with one that cannot be booked online
test.use({
  bookingUrl:
    'https://www.booking.com/hotel/cz/apartmany-u-petra-jesenik.cs.html?aid=304142&checkin=2026-07-05&checkout=2026-07-12&dest_id=-546544&dest_type=city&group_adults=4&group_children=0&label=gen173nr-10CAEoggI46AdIM1gEaDqIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4Av7RzsgGwAIB0gIkMmZkYTk3ZjUtMDljOS00YTM3LWExZDQtNWU2OWY4YjgyNGIw2AIB4AIB-Share-FY8kPf%401762896152&no_rooms=1&req_adults=4&req_children=0#room_981333503',
});

test.describe('Unhappy Path - Cannot Book Online', { tag: '@smoke' }, () => {
  test('Attempt to book accommodation that cannot be paid online', async ({
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

    await test.step('Enter Booking.com link that cannot be booked online', async () => {
      await orderPage.waitForPageLoad();
      // Fill in the booking URL that cannot be paid online
      await orderPage.fillBookingUrl(bookingUrl);
      // Trigger availability check
      await orderPage.checkAvailability();
    });

    await test.step('Verify error message indicating accommodation cannot be paid online', async () => {
      // Wait for accommodation page to load and verify error message
      await accommodationPage.waitForPageLoad();
      // Verify error message is displayed
      await accommodationPage.assertCannotBookOnlineError();

      await accommodationPage.assertContinueButtonDisabled();
    });
  });
});
