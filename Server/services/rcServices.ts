import { eq, and, sql } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { grievancesModel } from "../models/grievances";
import { studentModel } from "../models/studentModel";
import { rcModel } from "../models/rcModel";
import { approval_status } from "../constants/enum";
import { roomModel } from "../models/roomModel";




export async function createRC(
  name: string,
  userId: number,
  hostel: string,
) {
  const rc = await db
    .insert(rcModel)
    .values({
      name: name,
      userId: userId,
      hostel: hostel,
      onLeave: false,
      floor: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning();
  return rc;
}

export async function getAllRCs() {
  const rc = await db
    .select()
    .from(rcModel);
  return rc;
}

export async function deleteRC(rc_id : number) {
  const deletedRC = await db
    .delete(rcModel)
    .where(eq(rcModel.id, rc_id))
    .returning();
  return deletedRC;
}

export async function updateRC(
  rc_id: number,
  name: string,
  hostel: string,
  floor: number[],
) {
  const updatedRC = await db
    .update(rcModel)
    .set({
      name: name,
      hostel: hostel,
      floor: floor,
      updatedAt: new Date()
    })
    .where(eq(rcModel.id, rc_id))
    .returning();
  return updatedRC;
}

export async function getRCById(rc_id: number) {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.id, rc_id))
    .limit(1);
  return rc;
}


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
