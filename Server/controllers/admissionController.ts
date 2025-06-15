import httpStatus from "http-status";
import {
  createAdmission,
  getAdmissionByAdmissionId,
  getAdmissionByRollNumber,
  updateAdmission,
  checkForAdmissionByRollNumberAndAcademicYear,
} from "../services/admissionServices";
import { Request, Response } from "express";
import { createAdmissionSchema } from "../validation/admission.schema";
import { approval_status } from "../constants/enum";
import AppError from "../utils/AppError";

export async function createAdmissionController(req: Request, res: Response) {
  const admissionData = req.body;
  const parsedData = createAdmissionSchema.parse(admissionData);

  const existingAdmissions = await checkForAdmissionByRollNumberAndAcademicYear(
    parsedData.roll_number,
    parsedData.academicYear
  );
  if (existingAdmissions.length > 0) {
    throw AppError(
      "Admission already exists for the provided roll number and academic year",
      httpStatus.BAD_REQUEST
    );
  }
  const newAdmission = await createAdmission({
    ...parsedData,
    roomNumber: "",
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
  try {
    const { roll_number } = req.params;
    const admission = await getAdmissionByRollNumber(roll_number);
    if (admission.length === 0) {
      res.status(404).json({
        success: false,
        message: "Admission not found for the provided roll number",
      });
    }
    res.status(200).json({
      success: true,
      data: admission,
      message: "Admission retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving admission:", error);
    res.status(500).json({
      success: false,
      message: "Could not retrieve admission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getAdmissionByAdmissionIdController(
  req: Request,
  res: Response
) {
    const { admissionId } = req.params;
    const admission = await getAdmissionByAdmissionId(Number(admissionId));
    if (admission.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admission not found for the provided admission ID",
      });
    }
    res.status(200).json({
      success: true,
      data: admission,
      message: "Admission retrieved successfully",
    });
}

export async function updateAdmissionController(req: Request, res: Response) {
  try {
    const { admissionId } = req.params;
    const updatedData = req.body;

    const existingAdmission = await getAdmissionByAdmissionId(
      Number(admissionId)
    );
    if (existingAdmission.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admission not found for the provided admission ID",
      });
    }
    if (
      existingAdmission[0].status !== approval_status.submitted &&
      existingAdmission[0].status !== approval_status.declined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Admission can only be updated if it is in submitted or declined state",
      });
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
  } catch (error) {
    console.error("Error updating admission:", error);
    res.status(500).json({
      success: false,
      message: "Could not update admission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
