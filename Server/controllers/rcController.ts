import { Request, Response } from "express";
import {
  getRCById,
  getAdmissionsByHostelBlock,
  createAdmissionApproval,
  updateAdmissionStatus,
} from "../services/rcServices";
import { rcDecisionSchema } from "../validation/rc.schema";
import { ZodError } from "zod";
import { approval_status } from "../constants/enum";

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
    const validated = rcDecisionSchema.parse(req.body);
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
      roomNumber: validated.room,
      floor: validated.floor,
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