import { NewAdmission } from "./../models/admissionModel";
import { admissionModel } from "../models/admissionModel";
import { db } from "../config/dbConnection";
import { eq ,and} from "drizzle-orm";

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

export async function updateAdmission(
  admissionId: number,
  updatedData: Partial<NewAdmission>
) {
  const result = await db
    .update(admissionModel)
    .set(updatedData)
    .where(eq(admissionModel.id, admissionId))
    .returning({
      admissionId: admissionModel.id,
      status: admissionModel.status,
      updatedAt: admissionModel.updatedAt,
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


export async function checkForAdmissionByRollNumberAndAcademicYear(rollNumber: string, academicYear: string) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(and(
      eq(admissionModel.roll_number, rollNumber),
      eq(admissionModel.academicYear, academicYear)
    ));

    return result;
}


export async function getAdmissionByAdmissionId(admissionId: number) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(eq(admissionModel.id, admissionId));
  return result;
}


export async function getAdmissionsByStatus(status: string) {
  const result = await db
    .select()
    .from(admissionModel)
    .where(eq(admissionModel.status, status))
    .orderBy(admissionModel.submission_Date);
  return result;
}
