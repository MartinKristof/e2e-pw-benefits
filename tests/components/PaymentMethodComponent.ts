import { Page, Locator } from '@playwright/test';
import { PAYMENT_METHODS } from '../lib/paymentMethods';
import { ProjectName } from '../lib/routes';

/**
 * Component abstraction for Payment Method Selection
 * Handles payment method dropdown and selection logic
 * Reference: https://playwright.dev/docs/pom
 */
export class PaymentMethodComponent {
  readonly page: Page;
  readonly projectName: ProjectName;
  readonly paymentDropdown: Locator;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;
    this.paymentDropdown = page.locator('.payment-form__option .select__button');
  }

  async selectPaymentMethod(methodName: string): Promise<void> {
    // Normalize voucher to bank-transfer (voucher is pre-applied via insertAndApplyVoucher)
    const effectiveMethod = methodName === 'voucher' ? 'bank-transfer' : methodName;

    if (this.projectName === 'whitelabel') {
      const mapValue = (method: string) => {
        switch (method) {
          case 'pluxee-benefit-card':
            return 0;
          case 'bank-transfer':
          default:
            return 2;
        }
      };

      await this.page
        .getByLabel('Způsob platby')
        // .getByRole('combobox')
        .selectOption({ index: mapValue(effectiveMethod) });
    } else {
      // Open dropdown
      await this.paymentDropdown.click();
      await this.page.waitForLoadState('domcontentloaded');

      // Get the pattern for the method from PAYMENT_METHODS config
      const methodConfig = PAYMENT_METHODS[effectiveMethod as keyof typeof PAYMENT_METHODS];
      if (!methodConfig) {
        throw new Error(`Unknown payment method: ${effectiveMethod}`);
      }

      // Find and click the payment method button
      const methodButton = this.page
        .locator('button')
        .filter({ hasText: methodConfig.uiPattern })
        .first();
      if (!(await methodButton.isVisible({ timeout: 2000 }).catch(() => false))) {
        throw new Error(`Payment method "${methodName}" is not available`);
      }

      await methodButton.click();
    }
    await this.page.waitForLoadState('domcontentloaded');
  }
}
