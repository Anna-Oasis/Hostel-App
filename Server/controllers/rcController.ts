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
import { ZodError } from "zod";
import { approval_status } from "../models/enum";

export const viewAdmissionsByRC = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;

  try {
    const rc = await getRCById(Number(rc_id));
    if (rc.length === 0) {
      res.status(404).json({ success: false, message: "RC not found" });
      return;
    }

    const admissions = await getAdmissionsByHostelBlock(rc[0].hostel);
    res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const approveOrDeclineAdmissionByRC = async (req: Request, res: Response): Promise<void> => {
  const { admission_id } = req.params;

  try {
    const validated = rcAdmissionDecisionSchema.parse(req.body);
    const status = validated.approve ? approval_status.rc : approval_status.declined;

    await createAdmissionApproval({
      admission_id: Number(admission_id),
      user_id: validated.rc_id,
      approve: validated.approve,
      comment: validated.comment,
    });

    await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status,
      roomNumber: validated.approve ? validated.room : ' ', // Empty string if declined
      floor: validated.approve ? validated.floor : -1 // -1 if declined
    });

    res.status(200).json({
      success: true,
      message: "Admission approval submitted",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
      return;
    }

    console.error("❌ RC approval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const viewGrievancesByRC = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;

  try {
    const rc = await getRCById(Number(rc_id));
    if (rc.length === 0) {
      res.status(404).json({ success: false, message: "RC not found" });
      return;
    }

    const grievances = await getGrievances(rc[0].hostel, rc[0].floor);
    res.status(200).json({ success: true, data: grievances });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const approveOrDeclineGrievancesByRC = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;

  try {
    const validated = rcGrievanceDecisionSchema.parse(req.body);
    const rc = await getRCById(Number(rc_id));
    if (rc.length === 0) {
      res.status(404).json({ success: false, message: "RC not found" });
      return;
    }

    await updateGrievanceApprovalStatus({
      grievance_id: validated.grievances_id,
      rc_approval: validated.approve
    });

    res.status(200).json({
      success: true,
      message: "Grievance approval submitted",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors,
      });
      return;
    }
    console.error("❌ RC approval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

