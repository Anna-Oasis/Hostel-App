import { eq, desc, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { studentModel } from "../models/studentModel";
import { feePayment, NewFeePayment } from "../models/feePaymentModel";
import { admissionModel } from "../models/admissionModel";


export async function findStudentByUserId(userId: number) {
  const result = await db
    .select()
    .from(studentModel)
    .where(eq(studentModel.user_id, userId));

  return result[0];
}

export async function createFeePaymentService(feePaymentData: NewFeePayment) {
  const result = await db
    .insert(feePayment)
    .values(feePaymentData)
    .returning({
      admissionId: feePayment.id,
      status: feePayment.status,
    });
  return result;
}

export async function getLatestAdmissionByRollNumber(rollNo: string) {
    const result = await db
        .select()
        .from(admissionModel)
        .where(eq(admissionModel.roll_number, rollNo))
        .orderBy(desc(admissionModel.submission_Date))
        .limit(1);

    return result[0];
}

export async function getLatestAdmissionForAcademicYear(roll_number:string, academicYear : string) {
  const result = await db
        .select()
        .from(admissionModel)
        .where(
          and(
            eq(admissionModel.roll_number, roll_number),
            eq(admissionModel.academicYear, academicYear)
          ))
        .orderBy(desc(admissionModel.submission_Date))
        .limit(1);

    return result[0];
}