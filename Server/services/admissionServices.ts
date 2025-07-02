import { NewAdmission } from "./../models/admissionModel";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { db } from "../config/dbConnection";
import { eq, and } from "drizzle-orm";
import { admissionApprovalStatus } from "../constants/enum";
// import { eq, and } from "drizzle-orm";

interface NewAdmissionApproval {
  admission_id: number;
  user_id: number;
  approve: boolean;
  comment?: string | null;
}

interface AdmissionUpdateParams {
  admission_id: number;
  status: typeof admissionApprovalStatus[keyof typeof admissionApprovalStatus];
}

export async function findStudentByUserId(userId: number) {
  const result = await db
    .select()
    .from(studentModel)
    .where(eq(studentModel.user_id, userId));

  return result[0];
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

export const getAdmissionsToBeApprovedByRcByHostelBlock = async (hostelBlock: string) => {
  const admissions = await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(
      and(
        eq(admissionModel.status, admissionApprovalStatus.MANAGER),
        eq(admissionModel.hostelBlock, hostelBlock)
      ))
    .orderBy(admissionModel.submission_Date);
  return admissions;
};

export const getRollNumberByAdmissionId = async (admission_id: number) => {
  const admission = await db
    .select({ roll_number: admissionModel.roll_number })
    .from(admissionModel)
    .where(eq(admissionModel.id, admission_id))
    .limit(1);
    
  return admission[0].roll_number;
};

export const getRoomByRollNo = async (roll_number: string) => {
  const result = await db
    .select({ room: studentModel.roomNumber })
    .from(studentModel)
    .where(eq(studentModel.rollNo, roll_number))
    .limit(1);
    
  return result[0].room;
};
// export const createAdmissionApproval = async (approvalInfo: NewAdmissionApproval) => {
//   return await db
//     .insert(admissionApprovalsModel)
//     .values(approvalInfo)
//     .returning();
// };

export async function getAdmissionsByStatus(status: string) {
  const result = await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(eq(admissionModel.status, status))
    .orderBy(admissionModel.submission_Date);
  return result;
}

export async function createAdmissionApproval(approvalData: {
  admission_id: number;
  user_id: number;
  approve: boolean;
  comment?: string | null;
}) {
  // Check if record already exists
  const existingApproval = await db
    .select()
    .from(admissionApprovalsModel)
    .where(
      and(
        eq(admissionApprovalsModel.admission_id, approvalData.admission_id),
        eq(admissionApprovalsModel.user_id, approvalData.user_id)
      )
    );

  if (existingApproval.length > 0) {
    // Update existing record
    const result = await db
      .update(admissionApprovalsModel)
      .set({
        approve: approvalData.approve,
        comment: approvalData.comment || null,
        timestamp: new Date(), // Update timestamp
      })
      .where(
        and(
          eq(admissionApprovalsModel.admission_id, approvalData.admission_id),
          eq(admissionApprovalsModel.user_id, approvalData.user_id)
        )
      )
      .returning();
    return result;
  } else {
    // Insert new record
    const result = await db
      .insert(admissionApprovalsModel)
      .values({
        admission_id: approvalData.admission_id,
        user_id: approvalData.user_id,
        approve: approvalData.approve,
        comment: approvalData.comment || null,
      })
      .returning();
    return result;
  }
}

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

export const getAcademicYearByAdmissionId = async (admission_id: number) => {
  const admission = await db
    .select({ academicYear: admissionModel.academicYear })
    .from(admissionModel)
    .where(eq(admissionModel.id, admission_id))
    .limit(1);
    
  return admission[0].academicYear;
};

export const getAdmissionsApprovedByUser = async (userID: number) => {
  return await db
    .select()
    .from(admissionApprovalsModel)
    .innerJoin(admissionModel, eq(admissionModel.id, admissionApprovalsModel.admission_id))
    .where(eq(admissionApprovalsModel.user_id, userID))
    .orderBy(admissionApprovalsModel.timestamp);
};
