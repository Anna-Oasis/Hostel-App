import { Response } from "express";
import { AuthenticatedRequest } from "../types/roles";
import { DeputyWardenService } from "../services/deputyWardenService";

export class DeputyWardenController {
  private deputyWardenService: DeputyWardenService;

  constructor() {
    this.deputyWardenService = new DeputyWardenService();
  }

  async getAdmissionApprovals(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.userRole || req.userRole !== "deputyWarden" || !req.userId) {
      res.status(403).json({ error: "Access denied." });
      return;
    }

    try {
      const approvals = await this.deputyWardenService.getAdmissionApprovals(Number(req.userId));
      res.json(approvals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
} 