// src/models/policyAP.ts

export enum PolicyType {
  COMPULSORY_MOTOR = "COMPULSORY_MOTOR", // พ.ร.บ.
  VOLUNTARY_MOTOR = "VOLUNTARY_MOTOR", // ประกันภาคสมัครใจ
}

export enum PolicyStatus {
  NOTIFIED = "NOTIFIED", // แจ้งงานแล้ว
  RECEIVED_NOTIFIED = "RECEIVED_NOTIFIED", // รับแจ้งงานแล้ว
  APPLICATION_CREATED = "APPLICATION_CREATED", // สร้างใบคำขอแล้ว
  POLICY_RECEIVED = "POLICY_RECEIVED", // ได้รับกรมธรรม์แล้ว
}

export enum APStatus {
  VALIDATED = "VALIDATED", // ตรวจสอบแล้ว
  DISPUTED = "DISPUTED", // มีข้อโต้แย้ง
}

export interface PolicyAP {
  requestedID: string; // Primary Key
  policyNumber: string;
  customerName: string;
  licenseNumber: string;
  effectiveDate: string; // Date ISO string
  createdDate: string; // Date ISO string
  premium: number;
  premiumTotal: number;
  policyType: PolicyType;
  policyStatus: PolicyStatus;
  apStatus: APStatus;
}
