import { AuthenticatedRequest } from "../types/roles";
import { Request, Response } from "express";
import { getAdmissionApprovals, resolveGrievance, getGrievances } from "../services/managerService";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { getAdmissionsByStatus, getAdmissionByAdmissionId, updateAdmission, createAdmissionApproval } from "../services/admissionServices";
import { approval_status } from "../constants/enum";
import { managerAdmissionDecisionSchema } from "../validation/manager.schema";


// \manager\admissions: GET – Fetch all admissions waiting for manager approval
export async function getAdmissionWaitingForApprovalByManagerController(req: Request, res: Response) {
  const submittedAdmissions = await getAdmissionsByStatus(approval_status.submitted);

  if (submittedAdmissions.length === 0) {
    throw AppError(
      "No admissions waiting for manager approval",
      httpStatus.NOT_FOUND
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: submittedAdmissions,
    count: submittedAdmissions.length,
    message: "Admissions retrieved successfully"
  });
}

// \manager\admissions: PUT – use \admission_id to approve or decline by manager, entry into admission_approval table with comment(if declined) 
export async function updateApprovalStatusByManagerController(req: Request, res: Response) {
  const { admission_id } = req.params;
  const parsedData=managerAdmissionDecisionSchema.parse(req.body);

  // If status is false, comment is required
  if (parsedData.approve === false && (!parsedData.comment || parsedData.comment.trim() === '')) {
    throw AppError(
      "Comment is required when declining an admission", httpStatus.BAD_REQUEST
    );
  }

  const existingAdmission = await getAdmissionByAdmissionId(Number(admission_id));
  if (existingAdmission.length === 0) {
    throw AppError(
      "Admission not found for the provided ID", httpStatus.NOT_FOUND
    );
  }

  const newStatus = parsedData.approve ? approval_status.manager: approval_status.declined;

  const updatedAdmission = await updateAdmission(Number(admission_id), {
    status: newStatus,
    updatedAt: new Date(),
  });

  const approvalEntry = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: parsedData.user_id,
    approve: parsedData.approve,
    comment: parsedData.comment || null,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      admission: updatedAdmission,
      approval: approvalEntry[0]
    },
    message: parsedData.approve 
      ? "Admission approved and forwarded to RC" 
      : "Admission declined successfully",
  });
}

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