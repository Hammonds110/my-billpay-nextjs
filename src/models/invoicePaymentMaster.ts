export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
}

export enum PolicyType {
  COMPULSORY_MOTOR = "COMPULSORY_MOTOR",
  VOLUNTARY_MOTOR = "VOLUNTARY_MOTOR",
}

export interface InvoicePaymentItem {
  invoiceID: string; // Primary Key
  importID: string; // Foreign Key (InvoicePaymentMaster)
  invoicePolicyNumber: string;
  licenseNumber: string;
  assuredName: string;
  effectiveDate: string; // Date ISO string
  createdDate: string; // Date ISO string
  premium: number;
  premiumTotal: number;
  isReconciled: boolean;
}
export interface InvoicePaymentMaster {
  importID: string; // Primary Key
  invoiceDate: string; // Date ISO string
  importBy: string;
  importDate: string; // Date ISO string
  ircpID: string;
  policyType: PolicyType;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  items: InvoicePaymentItem[]; // รายการย่อย
}
