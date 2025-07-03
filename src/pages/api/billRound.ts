// src/pages/api/billRound.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { BillRoundService } from "@/services/billRoundService";
import { BillRound } from "@/models/billRound";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<BillRound[] | BillRound | { error: string }>
) {
  if (req.method === "GET") {
    const data = BillRoundService.getAllBillRounds();
    return res.status(200).json(data);
  }
  if (req.method === "POST") {
    const bill = req.body as BillRound;
    const created = BillRoundService.createBillRound(bill);
    return res.status(201).json(created);
  }
  res.status(405).json({ error: "Method Not Allowed" });
}
