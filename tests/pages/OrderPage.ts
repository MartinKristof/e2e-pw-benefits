import { Page, Locator, expect } from '@playwright/test';
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
    this.bookingUrlInput = page.locator('form').getByRole('textbox');
    this.checkAvailabilityButton = page.locator('form').getByRole('button');
  }

  async goto() {
    await this.page.goto(ROUTES[this.projectName].order);
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].order);
    await expect(this.bookingUrlInput).toBeVisible();
  }

  async fillBookingUrl(url: string) {
    await this.bookingUrlInput.fill(url);
  }

  async checkAvailability() {
    await this.checkAvailabilityButton.click();
  }
}
