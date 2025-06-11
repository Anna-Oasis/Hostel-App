import {
  createAdmission,
  getAdmissionByAdmissionId,
  getAdmissionByRollNumber,
  updateAdmission,
  checkForAdmissionByRollNumberAndAcademicYear,
  getAdmissionsByStatus
} from "../services/admissionServices";
import { Request, Response } from "express";
import { createAdmissionSchema } from "../validation/admission.schema";
import { ZodError } from "zod";
import { approval_status } from "../models/enum";
import { db } from "../config/dbConnection";
import { admissionApprovalsModel } from "../models/admissionApprovals";
// ...other imports...
export async function getAdmissionWaitingForApprovalController(req: Request, res: Response) {
  try {
    // Fetch all admissions with submitted status using the service
    const submittedAdmissions = await getAdmissionsByStatus(approval_status.submitted);

    if (submittedAdmissions.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "No admissions waiting for manager approval",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: submittedAdmissions
    });

  } catch (error) {
    console.error("Error fetching submitted admissions:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function updateApprovalStatusController(req: Request, res: Response) {
  try {
    const { admission_id } = req.params;
    const { status, comment, user_id } = req.body;

    // Validate required fields
    if (!admission_id || typeof status !== 'boolean' || !user_id) {
      return res.status(400).json({
        success: false,
        message: "Admission ID, status (boolean), and user_id are required",
      });
    }

    // // If status is false, comment is required
    // if (status === false && (!comment || comment.trim() === '')) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Comment is required when declining an admission",
    //   });
    // }

    // Fetch the existing admission
    const existingAdmission = await getAdmissionByAdmissionId(Number(admission_id));
    if (existingAdmission.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Admission not found for the provided ID",
      });
    }

    // Determine the new status based on boolean value
    const newStatus = status ? approval_status.rc : approval_status.declined;

    // Update the admission status
    const updatedAdmission = await updateAdmission(Number(admission_id), {
      status: newStatus,
      updatedAt: new Date(),
    });

    // Create entry in admission_approvals table
    const approvalEntry = await db.insert(admissionApprovalsModel).values({
      admission_id: Number(admission_id),
      user_id: Number(user_id),
      approve: status,
      comment: comment || null,
    }).returning();

    return res.status(200).json({
      success: true,
      data: {
        admission: updatedAdmission,
        approval: approvalEntry[0]
      },
      message: status 
        ? "Admission approved and forwarded to RC" 
        : "Admission declined successfully",
    });

  } catch (error) {
    console.error("Error updating admission approval status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

export async function createAdmissionController(req: Request, res: Response) {
  try {
    const admissionData = req.body;
    const parsedData = createAdmissionSchema.parse(admissionData);

    const existingAdmissions =
      await checkForAdmissionByRollNumberAndAcademicYear(
        parsedData.roll_number,
        parsedData.academicYear
      );
    if (existingAdmissions.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Admission already exists for this roll number and academic year",
      });
    }
    const newAdmission = await createAdmission({
      ...parsedData,
      roomNumber:"",
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
