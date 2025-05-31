import { db } from "../config/dbConnection";
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

