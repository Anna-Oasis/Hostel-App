import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { approval_status, user_role } from "../models/enum";

interface NewAdmissionApproval {
  admission_id: number;
  user_id: number;
  approve: boolean;
  comment?: string | null;
}

interface AdmissionUpdateParams {
  admission_id: number;
  status: typeof approval_status[keyof typeof approval_status];
  roomNumber: string;
  floor: number;
}

/*export async function isDeputyWarden(user_id: number) {
  const dw = await db
    .select()
    .from(userModel)
    .where(
        and(
            eq(userModel.id, user_id),
            eq(userModel.role, "DEPUTY_WARDEN")
        ));
  return dw;
}*/

export const getAdmissionsByDeputyWarden = async () => {
  const admissions = await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(
      and(
        eq(admissionModel.status, approval_status.rc),
      )
    );
  return admissions;
};

export const createAdmissionApprovalByDeputyWarden = async (approvalInfo: NewAdmissionApproval) => {
  const approvalInsert = await db
    .insert(admissionApprovalsModel)
    .values(approvalInfo)
    .returning();
  return approvalInsert;
};

export const updateAdmissionStatusByDeputyWarden = async ({
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
      floor
    })
    .where(eq(admissionModel.id, admission_id))
    .returning();
  return admissionUpdate;
};