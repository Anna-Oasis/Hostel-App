import { db, } from "../config/dbConnection";
import { grievancesModel } from "../models/grievances";
import { studentModel } from "../models/studentModel";
import { eq, and , inArray} from "drizzle-orm";
import { NewGrievance } from "../models/grievances";
import { grievance_status, hostel_block} from "../constants/enum";
import { hostel_block_pgEnum } from "../models/enum";
import { sql } from "drizzle-orm";

interface GrievanceUpdateParams {
  grievance_id: number;
  status: typeof grievance_status[keyof typeof grievance_status];
  updatedBy: string;
}

export const createGrievance = async (data: NewGrievance) => {
  return await db.insert(grievancesModel).values(data).returning();
};

export const getGrievancesByRollNumber = async (rollNumber: string) => {
  return await db
    .select()
    .from(grievancesModel)
    .where(eq(grievancesModel.roll_number, rollNumber));
};

export const getGrievancesForRC = async (hostelBlock: string, floors: number[]) => {
  console.log("Fetching grievances for hostel block:", hostelBlock, "on floors:", floors);
  console.log("Grievance Query Params:");
  console.log("Hostel Block:", hostelBlock);
  console.log("Floors:", floors);
  console.log("hostelBlock typeof:", typeof hostelBlock, "value:", hostelBlock);
  console.log("studentModel.hostelBlock typeof:", typeof studentModel.hostelBlock);
  console.log("enum values:", hostel_block_pgEnum.enumValues);
  // const hostelBlockEnumValue = hostelBlock as (typeof hostel_block_pgEnum.enumValues)[number];
  const hostelBlockEnumValue = hostelBlock as (typeof hostel_block_pgEnum.enumValues)[number];
  console.log("Converted hostelBlockEnumValue:", hostelBlockEnumValue);
  const grievances = await db
    .select()
    .from(grievancesModel)
    .innerJoin(studentModel, eq(grievancesModel.roll_number, studentModel.rollNo))
    .where(
      and(
        inArray(studentModel.floor, floors),
        eq(studentModel.hostelBlock, hostelBlockEnumValue),   
        eq(grievancesModel.status, grievance_status.submitted),       
      )
    );

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
    .select({
      grievanceId: grievancesModel.id,
      rollNo: grievancesModel.roll_number,
      formDetails: {
        grievanceType: grievancesModel.grievance_type,
        subject: grievancesModel.subject,
        description: grievancesModel.description,
      },
    })
    .from(grievancesModel)
    .where(
      eq(grievancesModel.status, grievance_status.rc)
    );
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
      .select({
        grievanceId: grievancesModel.id,
        rollNo: grievancesModel.roll_number,
        formDetails: {
          grievanceType: grievancesModel.grievance_type,
          subject: grievancesModel.subject,
          description: grievancesModel.description,
        },
        status: grievancesModel.status,
      })
      .from(grievancesModel);
}


