// src/repositories/invoicePaymentMasterRepo.ts

import {
  InvoicePaymentMaster,
  PaymentStatus,
  PolicyType,
} from "@/models/invoicePaymentMaster";

// Mock Data ตัวอย่าง
const invoiceMasters: InvoicePaymentMaster[] = [
  {
    importID: "IM20250707001",
    invoiceDate: new Date().toISOString(), // ISO string ✔️
    importBy: "admin",
    importDate: new Date().toISOString(), // ISO string ✔️
    ircpID: "AB123",
    policyType: PolicyType.COMPULSORY_MOTOR,
    totalAmount: 9900,
    paymentStatus: PaymentStatus.UNPAID,
    items: [
      {
        invoiceID: "INV001",
        importID: "IM20250707001",
        invoicePolicyNumber: "POL56789012",
        licenseNumber: "1กข9999",
        assuredName: "สมชาย ใจดี",
        effectiveDate: new Date().toISOString(), // ISO string ✔️
        createdDate: new Date().toISOString(), // ISO string ✔️
        premium: 3000,
        premiumTotal: 3500,
        isReconciled: false,
      },
      {
        invoiceID: "INV002",
        importID: "IM20250707001",
        invoicePolicyNumber: "POL56789013",
        licenseNumber: "2กข8888",
        assuredName: "สมหญิง รุ่งเรือง",
        effectiveDate: new Date().toISOString(),
        createdDate: new Date().toISOString(),
        premium: 5000,
        premiumTotal: 5400,
        isReconciled: true,
      },
    ],
  },
  // เพิ่ม mock data รายการอื่นได้
];

// Repository ฟังก์ชันหลัก
export const InvoicePaymentMasterRepo = {
  getAll: (): InvoicePaymentMaster[] => invoiceMasters,
  getById: (importID: string): InvoicePaymentMaster | undefined =>
    invoiceMasters.find((im) => im.importID === importID),
  add: (master: InvoicePaymentMaster): InvoicePaymentMaster => {
    // ป้องกัน field วันที่ไม่ถูกต้อง
    master.invoiceDate = new Date(master.invoiceDate).toISOString();
    master.importDate = new Date(master.importDate).toISOString();
    master.items = master.items.map((item) => ({
      ...item,
      effectiveDate: new Date(item.effectiveDate).toISOString(),
      createdDate: new Date(item.createdDate).toISOString(),
    }));
    invoiceMasters.push(master);
    return master;
  },
  // เพิ่ม update/delete function ได้ตามต้องการ
};
