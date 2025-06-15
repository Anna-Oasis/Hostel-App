import { Request, Response } from "express";
import { getAdmissionsByDeputyWarden, createAdmissionApprovalByDeputyWarden, updateAdmissionStatusByDeputyWarden } from "../services/deputyWardenServices";
import { deputyWardenDecisionSchema } from "../validation/deputy-warden.schema";
import { ZodError } from "zod";
import { approval_status } from "../models/enum";

export const viewAdmissionsByDeputyWardenController = async (req: Request, res: Response): Promise<void> => {
  try {
    const admissions = await getAdmissionsByDeputyWarden();
    res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    res.status(500).json({
      success: false,
      message,
    });
  }
};

export const approveOrDeclineAdmissionByDeputyWardenController = async (req: Request, res: Response): Promise<void> => {
  const { admission_id } = req.params;

  try {
    const validated = deputyWardenDecisionSchema.parse(req.body);
    const status = validated.approve ? approval_status.deputyWarden : approval_status.declined;

    await createAdmissionApprovalByDeputyWarden({
      admission_id: Number(admission_id),
      user_id: validated.user_id,
      approve: validated.approve,
      comment: validated.comment,
    });

    await updateAdmissionStatusByDeputyWarden({
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

    console.error("❌ Deputy Warden approval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

