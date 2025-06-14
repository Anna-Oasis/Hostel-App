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
