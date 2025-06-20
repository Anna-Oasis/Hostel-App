import { db, } from "../config/dbConnection";
import { grievancesModel } from "../models/grievances";
import { studentModel } from "../models/studentModel";
import { admissionModel } from "../models/admissionModel";
import { eq, and , sql, inArray} from "drizzle-orm";
import { NewGrievance } from "../models/grievances";
import { roomModel } from "../models/roomModel";

export const createGrievance = async (data: NewGrievance) => {
  return await db.insert(grievancesModel).values(data).returning();
};

export const getGrievancesByRollNumber = async (rollNumber: string) => {
  return await db
    .select()
    .from(grievancesModel)
    .where(eq(grievancesModel.roll_number, rollNumber));
};

export const getGrievancesForManager = async () => {
  return await db
    .select({
      greivanceId: grievancesModel.id,
      rollNo: grievancesModel.roll_number,
      formDetails: {
        grievanceType: grievancesModel.grievance_type,
        subject: grievancesModel.subject,
        description: grievancesModel.description,
      },
      resolved: grievancesModel.resolved,
    })
    .from(grievancesModel)
    .where(eq(grievancesModel.rc_approval, true));
};

export const resolveGrievanceByManager = async (grievanceId: number) => {
  return await db
    .update(grievancesModel)
    .set({ resolved: true })
    .where(eq(grievancesModel.id, grievanceId))
    .returning();
};

export const getGreivancesForDeputyWarden = async ()=>
{
    return db
        .select({
          greivanceId: grievancesModel.id,
          rollNo: grievancesModel.roll_number,
          formDetails: {
            grievanceType: grievancesModel.grievance_type,
            subject: grievancesModel.subject,
            description: grievancesModel.description,
          },
          resolved: grievancesModel.resolved,
        })
        .from(grievancesModel);
}

export const getGrievancesForRC = async (hostelBlock: string, floors: number[]) => {
  console.log("Fetching grievances for hostel block:", hostelBlock, "on floors:", floors);
  const grievances = await db
    .select()
    .from(grievancesModel)
    .innerJoin(studentModel, eq(grievancesModel.roll_number, studentModel.rollNo))
    .innerJoin(admissionModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .innerJoin(roomModel, eq(studentModel.roomNumber, roomModel.roomNumber))
    .where(
      and(
        inArray(roomModel.floor, floors),
        eq(admissionModel.hostelBlock, hostelBlock),   
        eq(grievancesModel.rc_approval, false),       
      )
    );
  return grievances;
};

export const updateGrievanceApprovalStatusByRC = async (params: {
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
