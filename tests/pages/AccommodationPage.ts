import { Page, Locator, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';
import { OrderSummaryComponent } from '../components/OrderSummaryComponent';

/**
 * Page Object Model for Order Page (Room Selection)
 * Reference: https://playwright.dev/docs/pom
 */
export class AccommodationPage {
  readonly page: Page;
  readonly projectName: ProjectName;
  readonly orderSummary: OrderSummaryComponent;
  readonly title: Locator;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    // Order Summary Component (handles button and pricing)
    this.orderSummary = new OrderSummaryComponent(page);
    this.title = page.getByRole('heading');
  }

  async waitForPageLoad() {
    await this.page.waitForURL('**' + ROUTES[this.projectName].accommodation + '/**');
    await expect(this.title).toBeVisible();
  }

  async selectRoom(quantity: number) {
    // Find the first available room option and click it
    // Rooms are typically displayed as clickable elements with pricing information
    const roomOption = this.page.locator('.select').first();

    await roomOption.click();
    await this.page.locator('.select__list-item').getByText(`${quantity}`).click();
  }

  async continueToDetails() {
    await this.orderSummary.assertReserveButtonEnabled();
    await this.orderSummary.submitReservation();
  }
}
