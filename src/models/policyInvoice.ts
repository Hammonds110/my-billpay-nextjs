export interface PolicyInvoice {
  importID: string; // ใช้สำหรับเชื่อมโยงกับ InvoicePaymentMaster
  invoiceID: string; // ใช้สำหรับเชื่อมโยงกับ InvoicePaymentItem
  invoiceDate: string; // วันที่ออกใบแจ้งหนี้
  customer: string;
  licenseNumber: string;
  assuredName: string;
  policyType: string; // หรือใช้ enum ถ้ามี
  policyStatus: string; // หรือใช้ enum ถ้ามี
  apStatus: string; // หรือใช้ enum ถ้ามี
  effectiveDate: string;
  expiredDate: string;
  premium: number;
  premiumTotal: number;
  isReconciled: boolean;
}
