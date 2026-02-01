import { Page, Locator } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';

/**
 * Page Object Model for Homepage
 * Reference: https://playwright.dev/docs/pom
 */
export class HomePage {
  readonly page: Page;
  readonly accommodationReservationLink: Locator;
  readonly projectName: ProjectName;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    // Select the "Accommodation reservation" link from navigation (language-neutral by role and text pattern)
    this.accommodationReservationLink = page
      .getByRole('link', { name: /accommodation|reservation|objednání|ubytování/i })
      .first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].homepage);
  }

  async clickAccommodationReservation() {
    await this.accommodationReservationLink.click();
  }

  async assertIsLoaded() {
    await this.page.waitForURL('/');
  }
}
