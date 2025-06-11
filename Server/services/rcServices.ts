import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { rcModel } from "../models/rcModel";
import { approval_status } from "../models/enum";

interface NewAdmissionApproval {
  admission_id: number;
  user_id: number;
  approve: boolean;
  comment?: string | null;
}

interface AdmissionUpdateParams {
  admission_id: number;
  status: typeof approval_status[keyof typeof approval_status]; // This is the key fix
  roomNumber: string;
  floor: number;
}

export async function getRCById(rc_id: number) {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.id, rc_id))
    .limit(1);
  return rc;
}

export const getAdmissionsByHostelBlock = async (hostelBlock: string) => {
  const admissions = await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(
      and(
        eq(admissionModel.status, approval_status.manager),
        eq(admissionModel.hostelBlock, hostelBlock)
      )
    );
  return admissions;
};

export const createAdmissionApproval = async (approvalInfo: NewAdmissionApproval) => {
  const approvalInsert = await db
    .insert(admissionApprovalsModel)
    .values(approvalInfo)
    .returning();
  return approvalInsert;
};

export const updateAdmissionStatus = async ({
  admission_id,
  status,
  roomNumber,
  floor,
}: AdmissionUpdateParams) => {
  const admissionUpdate = await db
    .update(admissionModel)
    .set({ 
      status,
      roomNumber,
      floor,
    })
    .where(eq(admissionModel.id, admission_id))
    .returning();
  return admissionUpdate;
};