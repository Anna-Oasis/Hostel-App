import { Router, Response } from "express";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { eq, and } from "drizzle-orm";
import { AuthenticatedRequest } from "../types/roles"; 
import { validateJWT } from "../middleware/jwt";

const router = Router();

router.get("/admissions/approvals", validateJWT, async (req: AuthenticatedRequest, res: Response) => {
    if (!req.userRole || req.userRole !== "manager" || !req.userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    try {
      const approvals = await db
        .select({
          admissionId: admissionModel.id,
          rollNumber: admissionModel.roll_number,
          academicYear: admissionModel.academicYear,
          status: admissionModel.status,
          approved: admissionApprovalsModel.approve,
          comment: admissionApprovalsModel.comment,
          timestamp: admissionApprovalsModel.timestamp,
        })
        .from(admissionApprovalsModel)
        .innerJoin(
          admissionModel,
          eq(admissionApprovalsModel.admission_id, admissionModel.id)
        )
        .where(
          and(
            eq(admissionApprovalsModel.user_id, Number(req.userId)),
            eq(admissionApprovalsModel.approve, true)
          )
        );

      res.json(approvals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
});

export default router;
