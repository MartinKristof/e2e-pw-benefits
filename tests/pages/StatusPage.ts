import { Page, Locator, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';

/**
 * Page Object Model for Status Page (Order Confirmation)
 * Reference: https://playwright.dev/docs/pom
 */
export class StatusPage {
  readonly page: Page;
  readonly projectName: ProjectName;
  readonly successIcon: Locator;
  readonly reservationSummary: Locator;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    // Success confirmation icon (checkmark circle)
    this.successIcon = page
      .locator('[class*="success"], [class*="check"], svg[class*="success"]')
      .first();
    // Reservation summary details (by CSS class, language-neutral)
    this.reservationSummary = page.locator('.status-info__title');
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].status + '/**');
  }

  async assertReservationConfirmation() {
    // Verify all key elements are present
    await expect(this.successIcon).toBeVisible();
    await expect(this.reservationSummary).toBeVisible();

    // TODO: assert the rest
  }
}
