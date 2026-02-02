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
    // Use semantic selectors (getByRole) that work across all variants
    this.bookingUrlInput = page.getByRole('textbox', { name: /Vložte odkaz|Wklej link/ });
    this.checkAvailabilityButton = page.getByRole('button', { name: /Ověřit|Sprawdź|Verificar/ });
  }

  async goto() {
    await this.page.goto(ROUTES[this.projectName].order);
  }

  async waitForPageLoad() {
    await this.page.waitForURL(ROUTES[this.projectName].order);
    await expect(this.bookingUrlInput).toBeVisible();
  }

  async fillBookingUrl(url: string) {
    await this.bookingUrlInput.scrollIntoViewIfNeeded();
    await this.bookingUrlInput.fill(url);
  }

  // Added autoretry because of occasional API timeouts causing modal errors
  async checkAvailability(maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Click the availability check button
        await this.checkAvailabilityButton.click();

        // Wait for successful navigation to accommodation page
        await this.page.waitForURL('**' + ROUTES[this.projectName].accommodation + '/**', {
          timeout: 5000,
        });

        // Success - page navigated to accommodation
        return;
      } catch {
        // Navigation failed - likely error modal appeared
        // Close any modal by clicking outside
        await this.page.click('body', { position: { x: 10, y: 10 } });

        if (attempt === maxRetries) {
          throw new Error(
            `Failed to check availability after ${maxRetries} attempts. API might be experiencing issues.`
          );
        }

        // Wait before retrying
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await this.page.waitForTimeout(1000);
      }
    }
  }
}
