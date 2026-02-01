import { Page, Locator, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';
import { OrderSummaryComponent } from '../components/OrderSummaryComponent';

/**
 * Page Object Model for Reservation Page (Checkout)
 * Reference: https://playwright.dev/docs/pom
 */
export class ReservationPage {
  readonly page: Page;
  readonly projectName: ProjectName;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly streetInput: Locator;
  readonly houseNumberInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cityInput: Locator;
  readonly voucherButton: Locator;
  readonly cancellationCheckbox: Locator;
  readonly businessCheckbox: Locator;
  readonly marketingCheckbox: Locator;
  readonly orderSummary: OrderSummaryComponent;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;

    // Guest Details
    this.firstNameInput = page.locator('#customer-firstname');
    this.lastNameInput = page.locator('#customer-lastname');
    this.emailInput = page.locator('#customer-email');
    this.phoneInput = page.locator('#customer-phone');
    this.streetInput = page.locator('#v-0-address1');
    this.houseNumberInput = page.locator('#v-0-address2');
    this.postalCodeInput = page.locator('#v-0-address3');
    this.cityInput = page.locator('#v-0-address4');

    // Payment & Voucher
    this.voucherButton = page.locator('.payment-form__coupon-actions button');

    // Terms & Conditions
    this.cancellationCheckbox = page.locator('#cancellation-conditions');
    this.businessCheckbox = page.locator('#business-conditions');
    this.marketingCheckbox = page.locator('#marketing');

    // Order Summary Component
    this.orderSummary = new OrderSummaryComponent(page);
  }

  async waitForPageLoad() {
    await this.page.waitForURL('**' + ROUTES[this.projectName].reservation + '/**');
  }

  async fillGuestDetails(details: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
  }) {
    await this.firstNameInput.fill(details.firstName);
    await this.lastNameInput.fill(details.lastName);
    await this.emailInput.fill(details.email);
    await this.phoneInput.fill(details.phone);
    await this.streetInput.fill(details.street);
    await this.houseNumberInput.fill(details.houseNumber);
    await this.postalCodeInput.fill(details.postalCode);
    await this.cityInput.fill(details.city);
  }

  async insertAndApplyVoucher(code: string) {
    await this.voucherButton.click();

    // Fill voucher code
    const voucherInput = this.page
      .locator('.payment-form__coupon-form input')
      .first();
    if (await voucherInput.isVisible()) {
      await voucherInput.fill(code);

      // Click apply button (usually near voucher input)
      const applyBtn = this.page.locator('.payment-form__coupon-form button');
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
      }
    }
  }

  async selectPaymentMethod(methodName: string): Promise<void> {
    // Click the payment method dropdown to reveal options
    const paymentDropdown = this.page.locator('.payment-form__option .select__button');
    await paymentDropdown.click();
    await this.page.waitForLoadState('domcontentloaded');

    // Map payment method identifiers to UI display names
    const methodMapping: { [key: string]: RegExp } = {
      'pluxee-benefit-card': /Pluxee/i,
      'edenred-benefit-card': /Edenred/i,
      'bank-transfer': /Bank|Transfer|Převodem|Przelewem/i,
      voucher: /Voucher|Poukaz/i,
    };

    // Get the regex pattern for the method
    const pattern = methodMapping[methodName];
    if (!pattern) {
      throw new Error(`Unknown payment method: ${methodName}`);
    }

    // Find and click the payment method button
    const methodButton = this.page.locator('button').filter({ hasText: pattern }).first();
    if (!(await methodButton.isVisible({ timeout: 2000 }).catch(() => false))) {
      throw new Error(`Payment method "${methodName}" is not available. Available: ${methodName}`);
    }

    await methodButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async submitReservation() {
    await this.orderSummary.submitReservation();
  }

  async checkCancellationPolicy() {
    await this.cancellationCheckbox.check();
  }

  async checkBusinessTerms() {
    await this.businessCheckbox.check();
  }

  async checkAllRequiredTerms() {
    await this.checkCancellationPolicy();
    await this.checkBusinessTerms();
  }

  async assertReserveButtonEnabled() {
    await expect(this.orderSummary.reserveAndPayButton).toBeEnabled();
  }

  async assertTotalPrice() {
    // TODO: improve
    expect(await this.orderSummary.getTotalPrice()).not.toBeUndefined();
  }
}
