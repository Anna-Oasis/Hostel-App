import { NewAdmission } from "./../models/admissionModel";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { db } from "../config/dbConnection";
import { eq ,and} from "drizzle-orm";
import { approval_status } from "../constants/enum";

interface NewAdmissionApproval {
  admission_id: number;
  user_id: number;
  approve: boolean;
  comment?: string | null;
}

interface AdmissionUpdateParams {
  admission_id: number;
  status: typeof approval_status[keyof typeof approval_status];
}

export async function createAdmission(admissionData: NewAdmission) {
  const result = await db
    .insert(admissionModel)
    .values(admissionData)
    .returning({
      admissionId: admissionModel.id,
      status: admissionModel.status,
    });
  return result;
}

export async function updateAdmission(
  admissionId: number,
  updatedData: Partial<NewAdmission>
) {
  const result = await db
    .update(admissionModel)
    .set(updatedData)
    .where(eq(admissionModel.id, admissionId))
    .returning({
      admissionId: admissionModel.id,
      status: admissionModel.status,
      updatedAt: admissionModel.updatedAt,
    });
  return result;
}

export async function getAdmissionByRollNumber(rollNumber: string) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(eq(admissionModel.roll_number, rollNumber));
  return result;
}

export async function checkForAdmissionByRollNumberAndAcademicYear(rollNumber: string, academicYear: string) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(and(
      eq(admissionModel.roll_number, rollNumber),
      eq(admissionModel.academicYear, academicYear)
    ));

    return result;
}


export async function getAdmissionByAdmissionId(admissionId: number) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(eq(admissionModel.id, admissionId));
  return result;
}

export const getRollNumberByAdmissionId = async (admission_id: number) => {
  const admission = await db
    .select({ roll_number: admissionModel.roll_number })
    .from(admissionModel)
    .where(eq(admissionModel.id, admission_id))
    .limit(1);
    
  return admission[0].roll_number;
};

export const createAdmissionApproval = async (approvalInfo: NewAdmissionApproval) => {
  return await db
    .insert(admissionApprovalsModel)
    .values(approvalInfo)
    .returning();
};

export const updateAdmissionStatus = async ({
  admission_id,
  status,
}: AdmissionUpdateParams) => {
  return await db
    .update(admissionModel)
    .set({ status })
    .where(eq(admissionModel.id, admission_id))
    .returning();
};