import { NewAdmission } from "./../models/admissionModel";
import { admissionModel } from "../models/admissionModel";
import { db } from "../config/dbConnection";
import { eq } from "drizzle-orm";

export async function createAdmission(admissionData: NewAdmission) {
  const result = await db
    .insert(admissionModel)
    .values(admissionData)
    .returning({
      admissionId: admissionModel.id,
      status: admissionModel.status,
    });
  return result;
}

export async function getAdmissionByRollNumber(rollNumber: string) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(eq(admissionModel.roll_number, rollNumber));
  return result;
}


export async function getAdmissionByAdmissionId(admissionId: number) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(eq(admissionModel.id, admissionId));
  return result;
}


