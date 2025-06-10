import { Request, Response } from "express";
import {
  getAdmissionsByRC,
  submitRCAdmissionDecision,
} from "../services/rcServices";
import { rcDecisionSchema } from "../validation/rc.schema";
import { ZodError } from "zod";

export const viewAdmissionsByRC = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;

  try {
    const admissions = await getAdmissionsByRC(Number(rc_id));
    res.status(200).json({ success: true, data: admissions });
  } 
  catch (error) {
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

    await submitRCAdmissionDecision({
      admission_id: Number(admission_id),
      rc_id: validated.rc_id,
      approve: validated.approve,
      comment: validated.comment,
      room: validated.room,
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
      return
    }

    console.error("❌ RC approval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

