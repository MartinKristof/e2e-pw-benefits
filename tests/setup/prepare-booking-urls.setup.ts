import { Page } from '@playwright/test';
import { test as setup } from '../fixtures/bookingFixture';

/**
 * Setup project: Prepares booking URLs for all project variants
 * This setup runs once before main tests and extracts booking URLs
 * that can be used for validation in smoke tests
 */
setup('prepare booking URLs', async ({ browser }) => {
  let bookingPage: Page | null = null;
  let extractedUrl = '';

  try {
    const context = await browser.newContext();
    bookingPage = await context.newPage();

    await bookingPage.goto('https://www.booking.com/searchresults.html');

    const todayDate = new Date();
    const checkInDate = new Date(todayDate);
    await bookingPage.waitForLoadState('domcontentloaded');
    const consentElement = bookingPage.locator('#onetrust-reject-all-handler');

    await consentElement.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await consentElement.click();

    await bookingPage.getByTestId('searchbox-dates-container').click();

    const datePickerCalendar = bookingPage.getByTestId('searchbox-datepicker-calendar');

    await datePickerCalendar.waitFor({ state: 'visible' });

    const checkOutDate = new Date(todayDate);
    checkOutDate.setDate(checkOutDate.getDate() + 10); // 10 days from today

    await datePickerCalendar
      .locator('[data-date="' + checkInDate.toISOString().split('T')[0] + '"]')
      .click();
    await datePickerCalendar
      .locator('[data-date="' + checkOutDate.toISOString().split('T')[0] + '"]')
      .click();

    const destinationInput = bookingPage
      .getByTestId('destination-container')
      .locator('input')
      .first();

    await destinationInput.fill('Prague');
    await bookingPage.keyboard.press('Enter');

    // Close Booking.com Genius popup if it appears
    const closeButton = bookingPage.getByRole('button', { name: /zavření/ });
    closeButton.click();

    const titleLink = bookingPage.getByTestId('property-card').first().getByTestId('title-link');

    const [detailTab] = await Promise.all([context.waitForEvent('page'), titleLink.click()]);

    await detailTab.waitForLoadState('domcontentloaded', { timeout: 10000 });

    const link = detailTab.locator('.hprt-roomtype-link').first();

    await link.click();

    const url = detailTab.url();
    if (url) {
      extractedUrl = url;
    }

    if (!extractedUrl) {
      throw new Error('Could not extract booking URL from Booking.com');
    }

    // Ensure URL is absolute
    if (!extractedUrl.startsWith('http')) {
      extractedUrl = `https://www.booking.com${extractedUrl}`;
    }
    console.log(`Extracted Booking URL: ${extractedUrl}`);

    // Pass the URL to the test
    process.env.BOOKING_URL = extractedUrl;
  } finally {
    // Clean up: close the page and context
    if (bookingPage) {
      await bookingPage.close().catch(() => {});
    }
  }
});
