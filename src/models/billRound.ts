// src/models/billRound.ts
import { PolicyInvoice } from "@/models/policyInvoice";

export enum BillStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PolicyType {
  COMPULSORY_MOTOR = "COMPULSORY_MOTOR",
  VOLUNTARY_MOTOR = "VOLUNTARY_MOTOR",
}

export interface BillRound {
  billRoundID: string;
  billDate: string;
  billStatus: BillStatus;
  ircpID: string;
  policyType: PolicyType;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  totalAmount: number;
  policyInvoices: PolicyInvoice[];
}
