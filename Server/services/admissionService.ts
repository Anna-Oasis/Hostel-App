import {db} from "../config/dbConnection"
import { admissionModel, Admission, NewAdmission } from "../models/admissionModel.js";
import { eq } from "drizzle-orm";

export async function createAdmission(admissionData: NewAdmission): Promise<Admission | null> {
  try {
    const [admission] = await db.insert(admissionModel).values(admissionData).returning();
    return admission;
  } catch (error) {
    console.error("Error creating admission:", error);
    return null;
  }
}

export async function getAdmissionById(user_id: number): Promise<Admission | null> {
  try {
    const admission = await db.select().from(admissionModel).where(eq(admissionModel.user_id, user_id))
    return admission || null;
  } catch (error) {
    console.error("Error fetching admission:", error);
    return null;
  }
}