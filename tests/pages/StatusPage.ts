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
    // Success confirmation icon - try semantic first, fallback to CSS
    this.successIcon = page.locator('.order-status__img, .icon.is-large').first();
    // Reservation summary - use semantic heading or fallback
    this.reservationSummary = page
      .getByRole('heading', { name: /odeslána|wysłane/i })
      .or(page.locator('.status-info__title'));
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].status + '/**');
    await expect(this.successIcon).toBeVisible();
  }

  async assertReservationConfirmation() {
    // Verify all key elements are present
    await expect(this.reservationSummary).toBeVisible();

    // TODO: assert the rest
  }
}
