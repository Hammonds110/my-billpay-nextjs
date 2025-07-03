// src/services/billRoundService.ts
import { BillRound } from "@/models/billRound";
import { BillRoundRepo } from "@/repositories/billRoundRepo";

export const BillRoundService = {
  getAllBillRounds: (): BillRound[] => {
    return BillRoundRepo.getAll();
  },
  createBillRound: (bill: BillRound) => {
    return BillRoundRepo.add(bill);
  },
  // ... เพิ่ม business logic, validation ได้
};
