import { Page, Locator } from '@playwright/test';

/**
 * Component abstraction for Order Summary sidebar
 * Handles the order recap/summary section with button and price display
 * Reference: https://playwright.dev/docs/pom
 */
export class OrderSummaryComponent {
  readonly page: Page;
  readonly container: Locator;
  readonly reserveAndPayButton: Locator;
  readonly totalPriceValue: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.locator('.order-summary');

    // Action Button - visible in desktop and mobile (hidden versions filtered out)
    this.reserveAndPayButton = this.container.locator('button.is-large:visible');

    // Summary Information - total price (last info item)
    this.totalPriceValue = this.container
      .locator('.order-summary__info-item')
      .filter({ has: page.locator('.order-summary__info-label') })
      .last()
      .locator('.order-summary__info-value');
  }

  async submitReservation() {
    await this.reserveAndPayButton.click();
  }

  async assertReserveButtonEnabled() {
    await this.reserveAndPayButton.isEnabled();
  }

  async getTotalPrice(): Promise<string | null> {
    return this.totalPriceValue.textContent();
  }
}
