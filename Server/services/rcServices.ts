import { eq, and, sql } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { grievancesModel } from "../models/grievances";
import { studentModel } from "../models/studentModel";
import { rcModel } from "../models/rcModel";
import { approval_status } from "../constants/enum";
import { roomModel } from "../models/roomModel";

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

export const getGrievances = async (hostelBlock: string, floors: number[]) => {
  const grievances = await db
    .select()
    .from(grievancesModel)
    .innerJoin(studentModel, eq(grievancesModel.roll_number, studentModel.rollNo))
    .innerJoin(admissionModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .innerJoin(roomModel, eq(studentModel.roomNumber, roomModel.roomNumber))
    .where(
      and(
        sql`${roomModel.floor} = ANY(${floors})`, 
        eq(admissionModel.hostelBlock, hostelBlock),   
        eq(grievancesModel.rc_approval, false),       
      )
    );
  return grievances;
};

export const updateGrievanceApprovalStatus = async (params: {
  grievance_id: number;
  rc_approval: boolean;
}) => {
  const grievanceUpdate = await db
    .update(grievancesModel)
    .set({ 
      rc_approval: params.rc_approval,
    })
    .where(eq(grievancesModel.id, params.grievance_id))
    .returning();
  return grievanceUpdate;
};
