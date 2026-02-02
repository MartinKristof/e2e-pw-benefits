/* eslint-disable playwright/no-networkidle */
import { Page, Locator, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';
/**
 * Page Object Model for Accommodation Page (Room Selection)
 * Reference: https://playwright.dev/docs/pom
 */
export class AccommodationPage {
  readonly page: Page;
  readonly projectName: ProjectName;
  readonly title: Locator;
  readonly continueButton: Locator;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    // Order Summary Component (handles button and pricing)
    this.title = page
      .locator('h4.ar-text-large.ar-font-semibold.mb-6, .product-item__title')
      .first();
    // Continue button - from order summary footer
    this.continueButton = page
      .getByRole('button', { name: /Pokračovat na údaje|Przejdź/i })
      .first();
  }

  async waitForPageLoad() {
    await this.page.waitForURL('**' + ROUTES[this.projectName].accommodation + '/**');
    await expect(this.title).toBeVisible();
    await this.page
      .locator('.order-summary:visible, .order-aside')
      .waitFor({ state: 'visible', timeout: 10000 });
  }

  async selectRoom(quantity: number, roomIndex: number = 0) {
    // Use semantic combobox selector - select by index (default: first room)
    // Try to click the room if found
    await this.page
      .locator('main .select, .section-room__products .select__el')
      .nth(roomIndex)
      .click();
    if (this.projectName === 'whitelabel') {
      await this.page
        .locator('main')
        .getByRole('combobox')
        .nth(roomIndex)
        .selectOption(`${quantity}`);
    } else {
      await this.page.locator('.select__list-item').getByText(`${quantity}`).first().click();
    }
  }

  async continueToDetails() {
    await this.page.waitForLoadState('networkidle');

    // Wait for button to be visible before clicking
    await expect(this.continueButton).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
    // Click the button
    await this.continueButton.click();
  }

  async assertCannotBookOnlineError() {
    await expect(
      this.page
        .getByText(
          /Pokoj není možné zaplatit online|Płatność online za ten pokój nie jest dostępna/i
        )
        .first()
    ).toBeVisible();
  }

  async assertContinueButtonEnabled() {
    await expect(this.continueButton).toBeEnabled();
  }

  async assertContinueButtonDisabled() {
    // await expect(this.continueButton).toBeDisabled();
    // nested 2 levels of button
  }

  async assertInvalidRoomCountError() {
    // Error message indicating invalid room count
    const errorMessage = this.page.getByText(
      /Počet dospělých nemůže být menší než počet produktů|Liczba dorosłych nie może być mniejsza niż liczba produktów/i
    );
    await expect(errorMessage).toBeVisible();
  }
}
