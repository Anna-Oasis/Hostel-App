import httpStatus from "http-status";
import {
  createAdmission,
  getAdmissionByAdmissionId,
  getAdmissionByRollNumber,
  updateAdmission,
  checkForAdmissionByRollNumberAndAcademicYear,
  getAdmissionsByStatus,
  createAdmissionApproval,
} from "../services/admissionServices";
import { Request, Response } from "express";
import { createAdmissionSchema } from "../validation/admission.schema";
import { ZodError } from "zod";
import { approval_status } from "../constants/enum";
import AppError from "../utils/AppError";
import { db } from "../config/dbConnection";
import { admissionApprovalsModel } from "../models/admissionApprovals";

export async function getAdmissionWaitingForApprovalController(req: Request, res: Response) {
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

export async function updateApprovalStatusController(req: Request, res: Response) {
  const { admission_id } = req.params;
  const { status, comment, user_id } = req.body;

  if (!admission_id || typeof status !== 'boolean' || !user_id) {
    throw AppError(
      "Admission ID, status (boolean), and user_id are required",
      httpStatus.BAD_REQUEST
    );
  }

  // If status is false, comment is required
  if (status === false && (!comment || comment.trim() === '')) {
    throw AppError(
      "Comment is required when declining an admission",
      httpStatus.BAD_REQUEST
    );
  }

  const existingAdmission = await getAdmissionByAdmissionId(Number(admission_id));
  if (existingAdmission.length === 0) {
    throw AppError(
      "Admission not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const newStatus = status ? approval_status.rc : approval_status.declined;

  const updatedAdmission = await updateAdmission(Number(admission_id), {
    status: newStatus,
    updatedAt: new Date(),
  });

  const approvalEntry = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: Number(user_id),
    approve: status,
    comment: comment || null,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      admission: updatedAdmission,
      approval: approvalEntry[0]
    },
    message: status 
      ? "Admission approved and forwarded to RC" 
      : "Admission declined successfully",
  });
}

export async function createAdmissionController(req: Request, res: Response) {
  const admissionData = req.body;  
  const parsedData = createAdmissionSchema.parse(admissionData);

  const existingAdmissions = await checkForAdmissionByRollNumberAndAcademicYear(
    parsedData.roll_number,
    parsedData.academicYear
  );
  if (existingAdmissions.length > 0) { //checks whether an admission already exists for the provided roll number and academic year
    throw AppError("Admission already exists for the provided roll number and academic year",httpStatus.BAD_REQUEST);
  }

  const newAdmission = await createAdmission({
    ...parsedData,
    status: approval_status.submitted,
    submission_Date: new Date(),
    updatedAt: new Date(),
  });

   res.status(httpStatus.CREATED).json({
    success: true,
    data: newAdmission,
    message: "Admission created successfully",
  });
}

export async function getAdmissionByRollNumberController(
  req: Request,
  res: Response
) {
  const { roll_number } = req.params;
  if (!roll_number) {
    throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
  }
  const admission = await getAdmissionByRollNumber(roll_number);
  if (admission.length === 0) {
    throw AppError(
      "Admission not found for the provided roll number",
      httpStatus.NOT_FOUND
    );
  }
  res.status(200).json({
    success: true,
    data: admission,
    message: "Admission retrieved successfully",
  });
}

export async function getAdmissionByAdmissionIdController(
  req: Request,
  res: Response
) {
  const { admissionId } = req.params;
  const admission = await getAdmissionByAdmissionId(Number(admissionId));
  if (admission.length === 0) {
    throw AppError(
      "Admission not found for the provided admission ID",
      httpStatus.BAD_REQUEST
    );
  }
  res.status(200).json({
    success: true,
    data: admission,
    message: "Admission retrieved successfully",
  });
}

export async function updateAdmissionController(req: Request, res: Response) {
  const { admissionId } = req.params;
  const updatedData = req.body;

  const existingAdmission = await getAdmissionByAdmissionId(
    Number(admissionId)
  );
  if (existingAdmission.length === 0) {
    throw AppError("Admission not found for the provided admission ID", httpStatus.BAD_REQUEST);
  }
  if (
    existingAdmission[0].status !== approval_status.submitted &&
    existingAdmission[0].status !== approval_status.declined
  ) {
    throw AppError(
      "Admission can only be updated if it is in submitted or declined status",
      httpStatus.BAD_REQUEST
    );
  }

  const updatedAdmission = await updateAdmission(Number(admissionId), {
    ...updatedData,
    updatedAt: new Date(),
    status: approval_status.submitted,
  });
  res.status(200).json({
    success: true,
    data: updatedAdmission,
    message: "Admission updated successfully",
  });
}
