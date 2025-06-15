import { Request, Response } from "express";
import {
  getRCById,
  getAdmissionsByHostelBlock,
  createAdmissionApproval,
  updateAdmissionStatus,
  getGrievances,
  updateGrievanceApprovalStatus
} from "../services/rcServices";
import { rcAdmissionDecisionSchema, rcGrievanceDecisionSchema } from "../validation/rc.schema";
import { approval_status } from "../constants/enum";
import httpStatus from "http-status";
import AppError from "../utils/AppError";

export const viewAdmissionsByRCController = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const admissions = await getAdmissionsByHostelBlock(rc[0].hostel);
  if (!admissions) {
    throw AppError("Failed to fetch admissions", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: admissions,
    message: "Fetched Admissions successfully", 
  });
};

export const approveOrDeclineAdmissionByRCController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;

  const validated = rcAdmissionDecisionSchema.parse(req.body);
  const status = validated.approve ? approval_status.rc : approval_status.declined;

  const approvalResult = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: validated.rc_id,
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError("Failed to create admission approval", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const updateResult = await updateAdmissionStatus({
    admission_id: Number(admission_id),
    status,
    roomNumber: validated.approve ? validated.room : '',
    floor: validated.approve ? validated.floor : -1
  });

  if (!updateResult) {
    throw AppError("Failed to update admission status", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Admission approval submitted successfully",
  });
};

export const viewGrievancesByRCController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rc_id } = req.params;

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const grievances = await getGrievances(rc[0].hostel, rc[0].floor);
  if (!grievances) {
    throw AppError("Failed to fetch grievances", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: grievances,
    message: "Fetched Grievances successfully",
  });
};

export const approveOrDeclineGrievancesByRCController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rc_id } = req.params;

  const validated = rcGrievanceDecisionSchema.parse(req.body);
  
  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const updateResult = await updateGrievanceApprovalStatus({
    grievance_id: validated.grievances_id,
    rc_approval: validated.approve
  });

  if (!updateResult) {
    throw AppError("Failed to update grievance status", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Grievance approval submitted successfully",
  });
};