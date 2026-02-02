import { Page, Locator } from '@playwright/test';
import { PAYMENT_METHODS } from '../lib/paymentMethods';

/**
 * Component abstraction for Payment Method Selection
 * Handles payment method dropdown and selection logic
 * Reference: https://playwright.dev/docs/pom
 */
export class PaymentMethodComponent {
  readonly page: Page;
  readonly paymentDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentDropdown = page.locator('.payment-form__option .select__button');
  }

  async selectPaymentMethod(methodName: string): Promise<void> {
    // Normalize voucher to bank-transfer (voucher is pre-applied via insertAndApplyVoucher)
    const effectiveMethod = methodName === 'voucher' ? 'bank-transfer' : methodName;

    // Open dropdown
    await this.paymentDropdown.click();
    await this.page.waitForLoadState('domcontentloaded');

    // Get the pattern for the method from PAYMENT_METHODS config
    const methodConfig = PAYMENT_METHODS[effectiveMethod as keyof typeof PAYMENT_METHODS];
    if (!methodConfig) {
      throw new Error(`Unknown payment method: ${effectiveMethod}`);
    }

    // Find and click the payment method button
    const methodButton = this.page.locator('button').filter({ hasText: methodConfig.uiPattern }).first();
    if (!(await methodButton.isVisible({ timeout: 2000 }).catch(() => false))) {
      throw new Error(`Payment method "${methodName}" is not available`);
    }

    await methodButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
