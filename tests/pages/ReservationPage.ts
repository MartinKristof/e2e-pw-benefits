import { Page, Locator, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';
import { OrderSummaryComponent } from '../components/OrderSummaryComponent';
import { PaymentMethodComponent } from '../components/PaymentMethodComponent';
import { PaymentMethodType, VOUCHER_METHOD } from '../lib/paymentMethods';

/**
 * Page Object Model for Reservation Page (Checkout)
 * Reference: https://playwright.dev/docs/pom
 */
export class ReservationPage {
  readonly VOUCHER_STATUS_ICON_ERROR_CLASS = 'is-error';
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
  readonly paymentMethod: PaymentMethodComponent;
  readonly voucherStatusIcon: Locator;

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
    this.voucherStatusIcon = page.locator('.payment-form__coupon-status-icon');

    // Order Summary Component
    this.orderSummary = new OrderSummaryComponent(page);

    // Payment Method Component
    this.paymentMethod = new PaymentMethodComponent(page);
  }

  async waitForPageLoad() {
    await this.page.waitForURL('**' + ROUTES[this.projectName].reservation + '/**');
    await expect(this.firstNameInput).toBeVisible();
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
    const voucherInput = this.page.locator('.payment-form__coupon-form input').first();
    if (await voucherInput.isVisible()) {
      await voucherInput.fill(code);

      // Click apply button (usually near voucher input)
      const applyBtn = this.page.locator('.payment-form__coupon-form button');
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
      }
    }
  }

  async assertVoucherAppliedSuccessfully() {
    // Check that the status icon does NOT have is-error class
    await expect(this.voucherStatusIcon).not.toContainClass(this.VOUCHER_STATUS_ICON_ERROR_CLASS);
  }

  async assertVoucherAppliedUnsuccessfully() {
    // Check that the status icon has is-error class
    await expect(this.voucherStatusIcon).toContainClass(this.VOUCHER_STATUS_ICON_ERROR_CLASS);
  }

  async applyVoucherIfNeeded(method: PaymentMethodType, voucherCode: string) {
    if (method === VOUCHER_METHOD) {
      await this.insertAndApplyVoucher(voucherCode);
      await this.assertVoucherAppliedSuccessfully();
    }
  }

  async selectPaymentMethod(methodName: string): Promise<void> {
    await this.paymentMethod.selectPaymentMethod(methodName);
  }

  async submitReservation() {
    await this.orderSummary.assertReserveButtonEnabled();
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
