import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { roomModel } from "../models/roomModel";
import { approval_status } from "../constants/enum";
import { getRollNumberByAdmissionId, getAdmissionByAdmissionId } from "./admissionServices";

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

export const getAdmissionsByDeputyWarden = async () => {
  return await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(eq(admissionModel.status, approval_status.rc));
};

export const createAdmissionApprovalByDeputyWarden = async (approvalInfo: NewAdmissionApproval) => {
  return await db
    .insert(admissionApprovalsModel)
    .values(approvalInfo)
    .returning();
};

export const updateAdmissionStatusByDeputyWarden = async ({
  admission_id,
  status,
}: AdmissionUpdateParams) => {
  return await db
    .update(admissionModel)
    .set({ status })
    .where(eq(admissionModel.id, admission_id))
    .returning();
};

export const checkRoom= async (
  roomNumber: number, 
  hostelBlock: string, 
  academicYear: string
) => {
  const room = await db
    .select()
    .from(roomModel)
    .where(
      and(
        eq(roomModel.roomNumber, roomNumber),
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    )
    .limit(1);
    
  return room[0];
};

export const removeStudentFromRoom = async (
  rollNo: string[],
  roomNumber: number,
  hostelBlock: string,
  academicYear: string,
) => {
  
  return await db
    .update(roomModel)
    .set({ rollNo })
    .where(
      and(
        eq(roomModel.roomNumber, roomNumber),
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    )
    .returning();
};

export const updateStudentRoomNumber = async (
  rollNo: string, 
  roomNumber: number | null
) => {
  return await db
    .update(studentModel)
    .set({ roomNumber })
    .where(eq(studentModel.rollNo, rollNo))
    .returning();
};