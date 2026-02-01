import { defineConfig, devices } from '@playwright/test';
import { BookingFixtures } from './tests/fixtures/bookingFixture';

export const paymentMethods = [
  // 'edenred-cafeteria',
  // 'up-benefit-card',
  // 'payment-card',
  'edenred-benefit-card',
  'pluxee-benefit-card',
  'bank-transfer',
  'voucher',
];

export default defineConfig<BookingFixtures>({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    locale: 'cs-CZ',
    timezoneId: 'Europe/Prague',
    validVoucherCode: 'TEST_VOUCHER_001',
  },

  projects: [
    {
      name: 'setup-booking-urls',
      testMatch: '**/setup/**',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cz',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://test-fe-cz.dovolena-za-benefity.cz',
        paymentMethods,
      },
      // dependencies: ['setup-booking-urls'],
    },
    {
      name: 'pl',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://test-fe-pl.dovolena-za-benefity.cz',
        locale: 'pl-PL',
        paymentMethods: paymentMethods.filter((method) => method !== 'edenred-benefit-card'), // Not available in PL
        validVoucherCode: 'TEST_VOUCHER_001',
      },
      // dependencies: ['setup-booking-urls'],
    },
    {
      name: 'whitelabel',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-pluxee-cz-preprod.azurewebsites.net',
        paymentMethods,
      },
      // dependencies: ['setup-booking-urls'],
    },
  ],
});
