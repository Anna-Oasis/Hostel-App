import { db } from "../config/dbConnection";
import { grievancesModel } from "../models/grievances";
import { eq } from "drizzle-orm";
import { NewGrievance } from "../models/grievances";

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
