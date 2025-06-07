import { db } from "../config/dbConnection";
import { eq } from "drizzle-orm";
import { admissionModel, Admission, NewAdmission } from "../models/admissionModel";

// Create a new admission
export async function createAdmission(admissionData: NewAdmission): Promise<Admission | null> {
  try {
    const [admission] = await db.insert(admissionModel).values(admissionData).returning();
    return admission;
  } catch (error) {
    console.error("Error creating admission:", error);
    return null;
  }
}

// Get an admission by ID
export async function getAdmissionById(admissionId: string): Promise<Admission | null> {
  try {
    const admissions = await db
      .select()
      .from(admissionModel)
      .where(eq(admissionModel.admissionId, Number(admissionId)))
      .limit(1);
    const admission = admissions[0] || null;
    return admission;
  } catch (error) {
    console.error("Error fetching admission by ID:", error);
    return null;
  }
}

// Get admissions by user ID
export async function getAdmissionsByUserId(userId: string): Promise<Admission[]> {
  try {
    const admissions = await db
      .select()
      .from(admissionModel)
      .where(eq(admissionModel.user_id, Number(userId)));
    return admissions;
  } catch (error) {
    console.error("Error fetching admissions by user ID:", error);
    return [];
  }
}


