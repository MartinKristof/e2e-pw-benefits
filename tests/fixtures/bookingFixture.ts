import { test as base, FullProject } from '@playwright/test';
import { AccommodationPage, HomePage, OrderPage, ReservationPage, StatusPage } from '../pages';
import { ProjectName } from '../lib/routes';

export type BookingFixtures = {
  bookingUrl: string;
  paymentMethods: string[];
  projectName: string;
  homePage: HomePage;
  orderPage: OrderPage;
  accommodationPage: AccommodationPage;
  reservationPage: ReservationPage;
  statusPage: StatusPage;
  validVoucherCode: string;
};

type CustomOptions = {
  paymentMethods: string[];
  validVoucherCode: string;
};

export const test = base.extend<BookingFixtures>({
  // bookingUrl: async ({ browser }, use) => {
  //   let bookingPage: Page | null = null;
  //   let extractedUrl = '';

  //   try {
  //     {}onst context = await browser.newContext();
  //     bookingPage = await context.newPage();

  //     await bookingPage.goto('https://www.booking.com/searchresults.html');

  //     const todayDate = new Date();
  //     const checkInDate = new Date(todayDate);

  //     await bookingPage.getByTestId('searchbox-dates-container').click();

  //     const checkOutDate = new Date(todayDate);
  //     checkOutDate.setDate(checkOutDate.getDate() + 10); // 10 days from today
  //     await bookingPage
  //       .getByTestId('searchbox-datepicker-calendar')
  //       .locator('[data-date="' + checkInDate.toISOString().split('T')[0] + '"]')
  //       .click();
  //     await bookingPage
  //       .getByTestId('searchbox-datepicker-calendar')
  //       .locator('[data-date="' + checkOutDate.toISOString().split('T')[0] + '"]')
  //       .click();

  //     const destinationInput = bookingPage
  //       .getByTestId('destination-container')
  //       .locator('input')
  //       .first();

  //     await destinationInput.fill('Prague');
  //     await bookingPage.keyboard.press('Enter');

  //     const titleLink = bookingPage.getByTestId('property-card').first().getByTestId('title-link');

  //     const [detailTab] = await Promise.all([context.waitForEvent('page'), titleLink.click()]);

  //     await detailTab.waitForLoadState('domcontentloaded', { timeout: 10000 });

  //     const link = detailTab.locator('.hprt-roomtype-link').first();

  //     await link.click();

  //     const url = detailTab.url();
  //     if (url) {
  //       extractedUrl = url;
  //     }

  //     if (!extractedUrl) {
  //       throw new Error('Could not extract booking URL from Booking.com');
  //     }

  //     // Ensure URL is absolute
  //     if (!extractedUrl.startsWith('http')) {
  //       extractedUrl = `https://www.booking.com${extractedUrl}`;
  //     }
  //     console.log(`Extracted Booking URL: ${extractedUrl}`);

  //     // Pass the URL to the test
  //     await use(extractedUrl);
  //   } finally {
  //     // Clean up: close the page and context
  //     if (bookingPage) {
  //       await bookingPage.close().catch(() => {});
  //     }
  //   }
  // },
  paymentMethods: async ({}, use, testInfo) => {
    // Get payment methods from project configuration
    const project = testInfo.project as FullProject<BookingFixtures, CustomOptions>;
    const paymentMethods = project.use.paymentMethods || [];
    console.log(`Using payment methods: ${paymentMethods.join(', ')}`);
    await use(paymentMethods);
  },
  validVoucherCode: async ({}, use, testInfo) => {
    const project = testInfo.project as FullProject<BookingFixtures, CustomOptions>;
    const validVoucherCode = project.use.validVoucherCode || '';
    console.log(`Using valid voucher code: ${validVoucherCode}`);
    await use(validVoucherCode);
  },
  homePage: async ({ page }, use, testInfo) => {
    const projectName = testInfo.project.name as ProjectName;
    // Placeholder for potential future use
    const homepage = new HomePage(page, projectName);
    await use(homepage);
  },
  orderPage: async ({ page }, use, testInfo) => {
    const projectName = testInfo.project.name as ProjectName;
    // Placeholder for potential future use
    const orderPage = new OrderPage(page, projectName);
    await use(orderPage);
  },
  accommodationPage: async ({ page }, use, testInfo) => {
    const projectName = testInfo.project.name as ProjectName;
    // Placeholder for potential future use
    const accommodationPage = new AccommodationPage(page, projectName);
    await use(accommodationPage);
  },
  reservationPage: async ({ page }, use, testInfo) => {
    const projectName = testInfo.project.name as ProjectName;
    // Placeholder for potential future use
    const reservationPage = new ReservationPage(page, projectName);
    await use(reservationPage);
  },
  statusPage: async ({ page }, use, testInfo) => {
    const projectName = testInfo.project.name as ProjectName;
    // Placeholder for potential future use
    const statusPage = new StatusPage(page, projectName);
    await use(statusPage);
  },
  bookingUrl: async ({}, use) => {
    // Use a valid test booking URL - static booking for reliability
    // This is a real Booking.com link that we know works for testing
    const testBookingUrl =
      'https://www.booking.com/hotel/cz/agate-prague-apartment.cs.html?aid=304142&label=gen173nr-10CAQoggI49ANIM1gEaDqIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtrV_ssGwAIB0gIkMWJiMGFlMTYtMWQ0OC00MzI4LWEwNTUtOGMxMGZiYzM4MDNm2AIB4AIB&sid=eadea571e115a8a1b004c649ac6c5ef0&all_sr_blocks=1325247401_405141954_2_0_0&checkin=2026-02-02&checkout=2026-02-09&dest_id=-553173&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&highlighted_blocks=1325247401_405141954_2_0_0&hpos=1&matching_block_id=1325247401_405141954_2_0_0&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&sr_pri_blocks=1325247401_405141954_2_0_0__48508&srepoch=1770020409&srpvid=127e3a9a3acd0439&type=total&ucfs=1&#room_1325247401';

    console.log(`Using static test Booking URL: ${testBookingUrl}`);
    await use(testBookingUrl);
  },
});

export { expect } from '@playwright/test';
