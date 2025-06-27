import { db, } from "../config/dbConnection";
import { grievancesModel } from "../models/grievances";
import { studentModel } from "../models/studentModel";
import { eq, and , inArray} from "drizzle-orm";
import { NewGrievance } from "../models/grievances";
import { grievanceApprovalStatus, hostelBlock} from "../constants/enum";
import { userModel } from "../models/userModel";

interface GrievanceUpdateParams {
  grievance_id: number;
  status: typeof grievanceApprovalStatus[keyof typeof grievanceApprovalStatus];
  updatedBy: string;
}

export const getGrievanceByGrievanceId = async (grievance_id: number) => {
  const result = await db
    .select()
    .from(grievancesModel)
    .where(eq(grievancesModel.id, grievance_id));
  return result;
};

export const createGrievance = async (data: NewGrievance) => {
  return await db.insert(grievancesModel).values(data).returning();
};

export const getGrievancesByRollNumber = async (rollNumber: string) => {
  return await db
    .select()
    .from(grievancesModel)
    .where(eq(grievancesModel.roll_number, rollNumber))
    .orderBy(grievancesModel.created_at);
};

export const getGrievancesForRC = async (hostelblock: typeof hostelBlock[keyof typeof hostelBlock], floors: number[]) => {
  console.log("Fetching grievances for hostel block:", hostelBlock, "on floors:", floors);
  const grievances = await db
    .select()
    .from(grievancesModel)
    .innerJoin(studentModel, eq(grievancesModel.roll_number, studentModel.rollNo))
    .where(
      and(
        inArray(studentModel.floor, floors),
        eq(studentModel.hostelBlock, hostelblock),   
        eq(grievancesModel.status, grievanceApprovalStatus.SUBMITTED),       
      )
    )
    .orderBy(grievancesModel.created_at);
  return grievances;
};

/*
export const updateGrievanceStatusByRC= async ({
  grievance_id,
  status,
}: GrievanceUpdateParams) => {
  const grievanceUpdate = await db
    .update(grievancesModel)
    .set({ 
      status,
      rc_decision_at: new Date()
    })
    .where(eq(grievancesModel.id, grievance_id))
    .returning();
  return grievanceUpdate;
};
*/

export const updateGrievanceStatus = async ({
  grievance_id,
  status,
  updatedBy
}: GrievanceUpdateParams) => {
  const updateData: Record<string, any> = { status };

  if (updatedBy === "rc") {
    updateData.rc_decision_at = new Date();
  }

  if (updatedBy === "manager") {
    updateData.resolved_at = new Date();
  }

  const grievanceUpdate = await db
    .update(grievancesModel)
    .set(updateData)
    .where(eq(grievancesModel.id, grievance_id))
    .returning();

  return grievanceUpdate;
};

export const getGrievancesForManager = async () => {
  return await db
    .select()
    .from(grievancesModel)
    .innerJoin(studentModel, eq(grievancesModel.roll_number, studentModel.rollNo))
    .where(
      eq(grievancesModel.status, grievanceApprovalStatus.RC)
    )
    .orderBy(grievancesModel.created_at);
};

/*
export const updateGrievanceStatusByManager= async ({
  grievance_id,
  status,
}: GrievanceUpdateParams) => {
  const grievanceUpdate = await db
    .update(grievancesModel)
    .set({ 
      status,
      resolved_at: new Date()
    })
    .where(eq(grievancesModel.id, grievance_id))
    .returning();
  return grievanceUpdate;
};*/

export const getGrievancesForDeputyWarden = async ()=>
{
  return db
      .select()
      .from(grievancesModel)
      .innerJoin(studentModel, eq(grievancesModel.roll_number, studentModel.rollNo))
      .orderBy(grievancesModel.created_at);
}


