import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { studentModel } from "../models/studentModel";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { admissionModel } from "../models/admissionModel";

export const deleteStudentProfileService = async (rollNo: string) => {
  return await db.transaction(async (tx) => {
    // Find the student
    const [student] = await tx
      .select()
      .from(studentModel)
      .where(eq(studentModel.rollNo, rollNo));

    if (!student) {
      throw AppError("Student not found", httpStatus.NOT_FOUND);
    }
    // Delete student
    await tx
      .delete(studentModel)
      .where(eq(studentModel.rollNo, rollNo));

    return student;
  });
};

export const deleteAdmissionByRollNumberService = async (
  rollNo: string
) => {
  const deleted = await db
    .delete(admissionModel)
    .where(eq(admissionModel.roll_number, rollNo))
    .returning();

  if (deleted.length === 0) {
    throw AppError("Admission not found", httpStatus.NOT_FOUND);
  }

  return deleted[0];
};