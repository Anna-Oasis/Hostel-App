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

import { getAdmissionsApprovedByRC } from "../services/rcAdmissionApprovalService";

import { db } from "../config/dbConnection";
import { admissionApprovalsModel } from "../models/admissionApprovals";

// student/admissions: POST – Create the admission for the student
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

// student/admissions: GET – \roll_number as path param and fetch the admission details and status of a particular student 
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



export const fetchAdmissionsApprovedByRC = async (
  req: Request,
  res: Response,
) => {
  try {
    const rcId = parseInt(req.params.rc_id);

    if (isNaN(rcId)) {
      throw AppError("Invalid RC ID", httpStatus.BAD_REQUEST);
    }

    const data = await getAdmissionsApprovedByRC(rcId);

    res.status(httpStatus.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    throw AppError(
      `Failed to fetch admissions for RC: ${message}`,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};