import { Response } from "express";
import { AuthenticatedRequest } from "../types/roles";
import { getAdmissionApprovals } from "../services/deputyWardenService";

export class DeputyWardenController {
  async getAdmissionApprovals(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.userRole || req.userRole !== "deputyWarden" || !req.userId) {
      res.status(403).json({ error: "Access denied." });
      return;
    }

    try {
      const approvals = await getAdmissionApprovals(Number(req.userId));
      res.json(approvals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
}