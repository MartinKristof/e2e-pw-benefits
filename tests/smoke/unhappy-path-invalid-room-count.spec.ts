/* eslint-disable playwright/expect-expect */
import { test } from '../fixtures/bookingFixture';

test.use({
  // Override booking URL with one that has 2 adults but we will try to select more rooms than allowed
  bookingUrl:
    'https://www.booking.com/hotel/cz/clarion-congress-prague.cs.html?aid=304142&label=gen173nr-10CAQoggI49ANIM1gEaDqIAQGYATO4AQfIAQ_YAQPoAQH4AQGIAgGoAgG4ApvPjswGwAIB0gIkZWZmYjAwNWEtZTk2OS00MjhlLWFlZjgtZDM1OWFiYzc4ZDJk2AIB4AIB&sid=eadea571e115a8a1b004c649ac6c5ef0&all_sr_blocks=7761602_94292436_1_1_0&checkin=2027-01-01&checkout=2027-01-09&dest_id=-553173&dest_type=city&dist=0&group_adults=1&group_children=0&hapos=1&highlighted_blocks=7761602_94292436_1_1_0&hpos=1&matching_block_id=7761602_94292436_1_1_0&no_rooms=1&req_adults=1&req_children=0&room1=A&sb_price_type=total&sr_order=popularity&sr_pri_blocks=7761602_94292436_1_1_0__2787144&srepoch=1770238499&srpvid=eeac930d99190210&type=total&ucfs=1&#room_7761602',
});

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
