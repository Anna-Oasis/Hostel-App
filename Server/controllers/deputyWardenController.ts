import { Request, Response } from "express";
import { 
  getAdmissionsByDeputyWarden, 
  createAdmissionApprovalByDeputyWarden, 
  updateAdmissionStatusByDeputyWarden 
} from "../services/deputyWardenServices";
import { deputyWardenDecisionSchema } from "../validation/deputy-warden.schema";
import { approval_status } from "../constants/enum";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

export const viewAdmissionsByDeputyWardenController = async (req: Request, res: Response): Promise<void> => {
  const admissions = await getAdmissionsByDeputyWarden();
  
  if (!admissions) {
    throw AppError("Failed to fetch admissions", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: admissions,
    message: "Fetched Admissions successfully",
  });
};

export const approveOrDeclineAdmissionByDeputyWardenController = async (req: Request, res: Response): Promise<void> => {
  const { admission_id } = req.params;

  const validated = deputyWardenDecisionSchema.parse(req.body);
  const status = validated.approve ? approval_status.deputyWarden : approval_status.declined;

  const approvalResult = await createAdmissionApprovalByDeputyWarden({
    admission_id: Number(admission_id),
    user_id: validated.user_id,
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError("Failed to create admission approval", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const updateResult = await updateAdmissionStatusByDeputyWarden({
    admission_id: Number(admission_id),
    status,
    roomNumber: validated.approve ? validated.room : '', // Empty string if declined
    floor: validated.approve ? validated.floor : -1 // -1 if declined
  });

  if (!updateResult) {
    throw AppError("Failed to update admission status", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Admission approval submitted successfully",
  });
};