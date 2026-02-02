/* eslint-disable playwright/no-networkidle */
import { Page, Locator, expect } from '@playwright/test';
import { ProjectName, ROUTES } from '../lib/routes';
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
  readonly reserveAndPayButton: Locator;
  readonly paymentMethod: PaymentMethodComponent;

  constructor(page: Page, projectName: ProjectName) {
    this.page = page;
    this.projectName = projectName;

    // Guest Details - use semantic selectors (getByRole)
    this.firstNameInput = page.getByRole('textbox', { name: /Jméno|Imię/ });
    this.lastNameInput = page.getByRole('textbox', { name: /Příjmení|Nazwisko/ });
    this.emailInput = page.getByRole('textbox', { name: /Emailová adresa|Adres e‑mail/ });
    this.phoneInput = page.getByRole('textbox', { name: /Telefonní číslo|Numer telefonu/ });
    this.streetInput = page.getByRole('textbox', { name: /Ulice|Ulica/ });
    this.houseNumberInput = page.getByRole('textbox', { name: /Číslo popisné|Numer domu/ });
    this.postalCodeInput = page.getByRole('textbox', { name: /PSČ|Kod pocztowy/ });
    this.cityInput = page.getByRole('textbox', { name: /Město|Miasto/ });

    // Payment & Voucher
    this.voucherButton = page.getByRole('button', { name: /poukaz|voucher|kupon/i });

    // Terms & Conditions
    this.cancellationCheckbox = page.getByRole('checkbox', { name: /storno|anulowania/i });
    this.businessCheckbox = page.getByRole('checkbox', { name: /obchodní|sprzedaży/i });
    this.marketingCheckbox = page.getByRole('checkbox', { name: /marketing|promocyjne/i });

    // Action Button
    this.reserveAndPayButton = page.getByRole('button', {
      name: /Rezervovat a zaplatit|Zarezerwować i zapłacić/,
    });

    // Payment Method Component
    this.paymentMethod = new PaymentMethodComponent(page, this.projectName);
  }

  async waitForPageLoad() {
    await this.page.waitForURL('**' + ROUTES[this.projectName].reservation + '/**');
    await expect(this.firstNameInput).toBeVisible();
    await this.page
      .locator('.order-summary:visible, .order-aside')
      .waitFor({ state: 'visible', timeout: 10000 });
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
    const voucherInput = this.page.getByRole('textbox', {
      name: /Vložte kód poukazu|Vložit slevový \/ dárkový|Wprowadź kod wartościowy/,
    });
    if (await voucherInput.isVisible()) {
      await voucherInput.fill(code);

      // Click apply button (usually near voucher input)
      const applyBtn = this.page.getByRole('button', { name: /Uplatnit|Zastosuj/ });
      if (await applyBtn.isVisible()) {
        await applyBtn.click();
      }
    }
  }

  async assertVoucherAppliedSuccessfully() {
    await expect(
      this.page.getByText(/byl úspěšně uplatněn|byl úspěšně aktivován|został pomyślnie aktywowany/)
    ).toBeVisible();
  }

  async assertVoucherAppliedUnsuccessfully() {
    await expect(this.page.getByText(/není validní|není platný|nie jest ważny/)).toBeVisible();
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
    await this.page.waitForLoadState('networkidle');
    await this.reserveAndPayButton.scrollIntoViewIfNeeded();
    await this.reserveAndPayButton.isEnabled();
    await this.reserveAndPayButton.click();
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
    await expect(this.reserveAndPayButton).toBeEnabled();
  }
}
