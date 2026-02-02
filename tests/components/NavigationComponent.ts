import { Page, Locator } from '@playwright/test';

/**
 * Component abstraction for Navigation
 * Handles header navigation links and menu items
 * Reference: https://playwright.dev/docs/pom
 */
export class NavigationComponent {
  readonly page: Page;
  readonly accommodationReservationLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Select the "Accommodation reservation" link from navigation (language-neutral by role and text pattern)
    this.accommodationReservationLink = page
      .getByRole('link', { name: /Rezervace ubytování|Rezerwacja/ })
      .first();
  }
  async clickAccommodationReservation() {
    await this.accommodationReservationLink.click();
  }
}
