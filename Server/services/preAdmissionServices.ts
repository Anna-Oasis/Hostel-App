import {
  preAdmissionModel,
  PreAdmission,
  NewPreAdmission,
} from "../models/preAdmission";
import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";

export async function createPreadmission(
  data: NewPreAdmission
): Promise<PreAdmission> {
  const [newPreadmission] = await db
    .insert(preAdmissionModel)
    .values(data)
    .returning();
  return newPreadmission;
}

export async function getPreadmissions(): Promise<PreAdmission[]> {
  return db.select().from(preAdmissionModel);
}


export async function getPreadmissionByEmail(email: string): Promise<PreAdmission | null> {
  const preAdmission = await db
    .select()
    .from(preAdmissionModel)
    .where(eq(preAdmissionModel.email,email))
    .limit(1)
    .execute();

  return preAdmission.length > 0 ? preAdmission[0] : null;
}