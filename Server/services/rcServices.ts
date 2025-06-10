import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { rcModel } from "../models/rcModel";
import { approval_status } from "../models/enum";

export const getAdmissionsByRC = async (rc_id: number) => {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.id, rc_id))
    .limit(1);

  if (rc.length === 0) {
    throw new Error("RC not found");
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

  return admissions;
};

export const submitRCAdmissionDecision = async ({
  admission_id,
  rc_id,
  approve,
  comment,
  room,
  floor,
}: {
  admission_id: number;
  rc_id: number;
  approve: boolean;
  comment?: string;
  room: string;
  floor: number;
}) => {
  const approvalInsert = await db
    .insert(admissionApprovalsModel)
    .values({
      admission_id,
      user_id: rc_id,
      approve,
      comment: comment ?? null,
    })
    .returning();

  const newStatus = approve ? approval_status.rc : approval_status.declined;

  const admissionUpdate = await db
    .update(admissionModel)
    .set({ 
      status: newStatus,
      roomNumber: room,
      floor: floor,
    })
    .where(eq(admissionModel.id, admission_id))
    .returning();

  return {
    approvalInsert,
    admissionUpdate,
  };
};
