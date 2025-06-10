import { Request, Response } from "express";
import { db } from "../config/dbConnection";
import { eq, and } from "drizzle-orm";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { rcModel } from "../models/rcModel";
import { approval_status } from "../models/enum";

export const viewAdmissionsByRC = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;
  try {
    console.log(`📥 Fetching RC (${rc_id}) admission approvals`);

    const rc = await db
      .select()
      .from(rcModel)
      .where(eq(rcModel.id, Number(rc_id)))
      .limit(1);

    if (rc.length === 0) {
      res.status(404).json({ success: false, message: "RC not found" });
      return;
    }

    const rcHostel = rc[0].hostel;

    const admissions = await db
      .select()
      .from(admissionModel)
      .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
      .where(
        and(
          eq(admissionModel.status, approval_status.manager),
          eq(admissionModel.hostelBlock, rcHostel)
        )
      );

    res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    console.error("❌ Error fetching admissions for RC:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const approveOrDeclineAdmissionByRC = async (req: Request, res: Response): Promise<void> => {
  const { admission_id } = req.params;
  const { rc_id, approve, comment, student_user_id, room, floor } = req.body;

  console.log("📥 Received RC decision:", req.body);

  if (
    approve === undefined ||
    !rc_id ||
    !student_user_id ||
    !room ||
    floor === undefined
  ) {
    res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
    return;
  }

  try {
    const approvalInsert = await db
      .insert(admissionApprovalsModel)
      .values({
        admission_id: Number(admission_id),
        user_id: Number(rc_id),
        approve,
        comment: comment ?? null,
      })
      .returning();

    console.log("✅ Approval entry created:", approvalInsert);

    const newStatus = approve ? approval_status.rc : approval_status.declined;

    const admissionUpdate = await db
      .update(admissionModel)
      .set({ 
        status: newStatus, 
        roomNumber: room,
        floor: floor
      })
      .where(eq(admissionModel.id, Number(admission_id)))
      .returning();

    console.log("✅ Admission status updated:", admissionUpdate);

    res.status(200).json({
      success: true,
      message: "Admission approval submitted",
    });
  } catch (error) {
    console.error("❌ RC approval error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};