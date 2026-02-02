import { defineConfig, devices } from '@playwright/test';
import { BookingFixtures } from './tests/fixtures/bookingFixture';
import { PROJECT_PAYMENT_METHODS } from './tests/lib/paymentMethods';

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
    validVoucherCode: 'TESTVOUCHER001',
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
        paymentMethods: PROJECT_PAYMENT_METHODS.cz,
      },
      // dependencies: ['setup-booking-urls'],
    },
    {
      name: 'pl',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://test-fe-pl.dovolena-za-benefity.cz',
        locale: 'pl-PL',
        paymentMethods: PROJECT_PAYMENT_METHODS.pl,
        validVoucherCode: 'TESTVOUCHER002',
      },
      // dependencies: ['setup-booking-urls'],
    },
    {
      name: 'whitelabel',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://wa-fe-dzb-pluxee-cz-preprod.azurewebsites.net',
        paymentMethods: PROJECT_PAYMENT_METHODS.whitelabel,
      },
      // dependencies: ['setup-booking-urls'],
    },
  ],
});
