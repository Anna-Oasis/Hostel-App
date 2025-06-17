import { AuthenticatedRequest } from "../types/roles";
import { Request, Response } from "express";
import { getAdmissionApprovals, resolveGrievance, getGrievances } from "../services/managerService";


export class ManagerController {
  async getAdmissionApprovals(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.userRole || req.userRole !== "manager" || !req.userId) {
      res.status(403).json({ error: "Access denied" });
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

  async resolveGrievance(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (req.userRole !== "manager") {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const grievanceId = Number(req.params.id);

    if (!grievanceId) {
      res.status(400).json({ message: "Grievance ID is required" });
      return;
    }

    try {
      const result = await resolveGrievance(grievanceId);

      if (!result || result.length === 0) {
        res.status(404).json({ error: 'Grievance ID is not found' });
        return;
      }

      res.status(200).json({ message: 'Grievance resolved successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal error" });
    }
  }

  async getGrievances(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.userId || req.userRole !== 'manager') {
      res.status(403).json({ message: "Access Denied." });
      return;
    }

    try {
      const awaitingGrievances = await getGrievances();
      res.status(200).json(awaitingGrievances);
    } catch (err) {
      console.error("Server Error");
      res.status(500).json({ error: "Server error" });
    }
  }
}