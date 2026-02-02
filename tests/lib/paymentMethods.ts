/**
 * Payment Methods DTO
 * Centralized definition of available payment methods used across config and tests
 */

export type ProjectType = 'cz' | 'pl' | 'whitelabel';

export type PaymentMethodType =
  | 'pluxee-benefit-card'
  | 'bank-transfer'
  | 'voucher'
  | 'edenred-benefit-card'
  | 'edenred-cafeteria'
  | 'up-benefit-card'
  | 'payment-card';

export const VOUCHER_METHOD = 'voucher';

// Payment methods with their availability per project
export const PAYMENT_METHODS: Record<
  PaymentMethodType,
  { name: string; availableIn: ProjectType[]; uiPattern: RegExp }
> = {
  'pluxee-benefit-card': {
    name: 'Pluxee Benefit Card',
    availableIn: ['cz', 'whitelabel'],
    uiPattern: /Pluxee/i,
  },
  'bank-transfer': {
    name: 'Bank Transfer',
    availableIn: ['cz', 'pl', 'whitelabel'],
    uiPattern: /Bank|Transfer|Převodem|Przelewem/i,
  },
  [VOUCHER_METHOD]: {
    name: 'Voucher',
    availableIn: ['cz', 'pl', 'whitelabel'],
    uiPattern: /Bank|Transfer|Převodem|Przelewem/i, // Mapped to bank-transfer in UI after application
  },
  'edenred-benefit-card': {
    name: 'Edenred Benefit Card',
    availableIn: [],
    uiPattern: /Edenred/i,
  },
  'edenred-cafeteria': {
    name: 'Edenred Cafeteria',
    availableIn: [],
    uiPattern: /Cafeterie/i,
  },
  'up-benefit-card': {
    name: 'UP Benefit Card',
    availableIn: [],
    uiPattern: /UP|Benefit/i,
  },
  'payment-card': {
    name: 'Payment Card',
    availableIn: [],
    uiPattern: /Payment|Card/i,
  },
} as const;

// Helper to get payment methods for specific project
const getPaymentMethodsForProject = (project: ProjectType): PaymentMethodType[] =>
  (Object.keys(PAYMENT_METHODS) as PaymentMethodType[]).filter((method) =>
    PAYMENT_METHODS[method].availableIn.includes(project)
  );

export const getAllPaymentMethods = (): PaymentMethodType[] =>
  Object.keys(PAYMENT_METHODS) as PaymentMethodType[];

// Project-specific payment methods
export const PROJECT_PAYMENT_METHODS = {
  cz: getPaymentMethodsForProject('cz'),
  pl: getPaymentMethodsForProject('pl'),
  whitelabel: getPaymentMethodsForProject('whitelabel'),
} as const;
