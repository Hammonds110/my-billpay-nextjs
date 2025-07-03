// src/repositories/billRoundRepo.ts
import { BillRound, BillStatus, PolicyType } from "@/models/billRound";

const billRounds: BillRound[] = [
  {
    billRoundID: "INB20250400001",
    billDate: new Date().toISOString(),
    billStatus: BillStatus.DRAFT,
    ircpID: "52",
    policyType: PolicyType.COMPULSORY_MOTOR,
    createdBy: "user1",
    createdDate: new Date().toISOString(),
    updatedBy: "user1",
    updatedDate: new Date().toISOString(),
    totalAmount: 1200,
    policyInvoices: [],
  },
];

export const BillRoundRepo = {
  getAll: () => billRounds,
  getById: (id: string) => billRounds.find((b) => b.billRoundID === id),
  add: (bill: BillRound) => {
    billRounds.push(bill);
    return bill;
  },
  // เพิ่ม update/delete ได้
};
