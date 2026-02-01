import { test as setup } from '../fixtures/bookingFixture';

/**
 * Setup project: Prepares booking URLs for all project variants
 * This setup runs once before main tests and extracts booking URLs
 * that can be used for validation in smoke tests
 */
setup('prepare booking URLs', async ({ bookingUrl }) => {
  // The bookingFixture.ts automatically extracts the booking URL
  // and we simply validate it here to ensure setup is successful

  if (!bookingUrl) {
    throw new Error('Failed to prepare booking URL in setup phase');
  }

  console.log(`[Setup] Booking URL prepared: ${bookingUrl}`);

  // Store URL in global state or environment for tests to use
  process.env.BOOKING_URL = bookingUrl;
});
