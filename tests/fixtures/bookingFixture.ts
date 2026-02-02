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
  bookingUrl: async ({}, use) => {
    if (process.env.BOOKING_URL) {
      console.log(`Using Booking URL from environment: ${process.env.BOOKING_URL}`);
      use(process.env.BOOKING_URL);
    } else {
      // Fallback static URL for testing
      const staticBookingUrl =
        'https://www.booking.com/hotel/cz/libero.cs.html?aid=304142&label=gen173nr-10CAQoggI49ANIM1gEaDqIAQGYATO4ARfIAQzYAQPoAQH4AQGIAgGoAgG4AtrV_ssGwAIB0gIkMWJiMGFlMTYtMWQ0OC00MzI8LWEwNTUtOGMxMGZiYzM4MDNm2AIB4AIB&sid=eadea571e115a8a1b004c649ac6c5ef0&all_sr_blocks=743523701_339046844_0_1_0_914117&checkin=2026-02-02&checkout=2026-02-09&dest_id=-553173&dest_type=city&dist=0&group_adults=1&group_children=0&hapos=2&highlighted_blocks=743523701_339046844_0_1_0_914117&hpos=2&matching_block_id=743523701_339046844_0_1_0_914117&no_rooms=1&req_adults=1&req_children=0&room1=A&sb_price_type=total&sr_order=popularity&sr_pri_blocks=743523701_339046844_0_1_0_914117_34570&srepoch=1770069584&srpvid=0acd9aa59e5405e5&type=total&ucfs=1&#room_743523701';
      console.log(`Using static Booking URL: ${staticBookingUrl}`);
      use(staticBookingUrl);
    }
  },
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
});

export { expect } from '@playwright/test';
