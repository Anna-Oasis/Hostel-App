import {
  createAdmission,
  getAdmissionByAdmissionId,
  getAdmissionByRollNumber,
  updateAdmission,
  checkForAdmissionByRollNumberAndPrevResidentFalse,
} from "../services/admissionServices";
import { Request, Response } from "express";
import { createAdmissionSchema } from "../validation/admission.schema";
import { ZodError } from "zod";
import { approval_status } from "../models/enum";

export async function createAdmissionController(req: Request, res: Response) {
  try {
    const admissionData = req.body;
    const parsedData = createAdmissionSchema.parse(admissionData);

    const existingAdmissions =
      await checkForAdmissionByRollNumberAndPrevResidentFalse(
        parsedData.roll_number
      );
    if (existingAdmissions.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Admission already exists for this roll number and previous resident is false",
      });
    }
    const newAdmission = await createAdmission({
      ...parsedData,
      status: approval_status.submitted,
      submission_Date: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({
      success: true,
      data: newAdmission,
      message: "Admission created successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors,
      });
    }
    console.error("Error creating admission:", error);
    res.status(500).json({
      success: false,
      message: "Could not create admission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getAdmissionByRollNumberController(
  req: Request,
  res: Response
) {
  try {
    const { roll_number } = req.params;
    const admission = await getAdmissionByRollNumber(roll_number);
    if (admission.length === 0) {
      return res.status(404).json({
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
  try {
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
  } catch (error) {
    console.error("Error retrieving admission:", error);
    res.status(500).json({
      success: false,
      message: "Could not retrieve admission",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
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
    if(existingAdmission[0].status !== approval_status.submitted && existingAdmission[0].status !== approval_status.declined) {
      return res.status(400).json({
        success: false,
        message: "Admission can only be updated if it is in submitted or declined state",
      });
    }

    const updatedAdmission = await updateAdmission(Number(admissionId), {
      ...updatedData,
      updatedAt: new Date(),
      status:approval_status.submitted, 
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
