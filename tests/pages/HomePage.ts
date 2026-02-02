import { Page, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';
import { NavigationComponent } from '../components/NavigationComponent';

/**
 * Page Object Model for Homepage
 * Reference: https://playwright.dev/docs/pom
 */
export class HomePage {
  readonly page: Page;
  readonly navigation: NavigationComponent;
  readonly projectName: ProjectName;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    // Navigation Component
    this.navigation = new NavigationComponent(page);
  }

  async goto() {
    await this.page.goto('/');
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].homepage);
    await expect(this.navigation.accommodationReservationLink).toBeVisible();
  }

  async clickAccommodationReservation() {
    await this.navigation.clickAccommodationReservation();
  }

  async assertIsLoaded() {
    await this.page.waitForURL('/');
  }
}
