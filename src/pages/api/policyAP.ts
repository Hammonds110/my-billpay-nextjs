// src/pages/api/policyAP.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { PolicyAP } from "@/models/policyAP";
import { PolicyAPRepo } from "@/repositories/policyAPRepo";

// รองรับทั้ง GET (ดึงทั้งหมด) และ POST (เพิ่มข้อมูล)
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<PolicyAP[] | PolicyAP | { error: string }>
) {
  if (req.method === "GET") {
    const data = PolicyAPRepo.getAll();
    return res.status(200).json(data);
  }
  if (req.method === "POST") {
    const ap = req.body as PolicyAP;
    // กัน error เรื่องวันที่ (optional ถ้าใน repo handle อยู่แล้ว)
    ap.effectiveDate = new Date(ap.effectiveDate).toISOString();
    ap.createdDate = new Date(ap.createdDate).toISOString();
    const created = PolicyAPRepo.add(ap);
    return res.status(201).json(created);
  }
  res.status(405).json({ error: "Method Not Allowed" });
}
