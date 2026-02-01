import { Page, Locator } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';

/**
 * Page Object Model for Order Page (Room Selection)
 * Reference: https://playwright.dev/docs/pom
 */
export class OrderPage {
  readonly page: Page;
  readonly projectName: ProjectName;
  readonly bookingUrlInput: Locator;
  readonly checkAvailabilityButton: Locator;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    this.bookingUrlInput = page
      .locator('input[placeholder*="Paste"]')
      .or(page.locator('input[placeholder*="Share"]'))
      .first();
    this.checkAvailabilityButton = page.locator('button.form-hotle-check__button');
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].order);
  }

  async fillBookingUrl(url: string) {
    await this.bookingUrlInput.fill(url);
  }

  async checkAvailability() {
    await this.checkAvailabilityButton.click();
    // Wait for the room selection to appear or for the continue button to become visible
    // Don't use networkidle as it may not be reliable
    await this.page.waitForSelector('button[type="submit"]', { timeout: 10000 }).catch(() => {});
  }
}
