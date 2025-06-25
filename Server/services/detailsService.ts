import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { studentModel } from "../models/studentModel";

export const findStudentByRollNo = async (rollNo: string) => {
  return await db
    .select()
    .from(studentModel)
    .where(eq(studentModel.rollNo, rollNo));
};

export const insertStudentDetails = async (data: any) => {
  return await db.insert(studentModel).values(data).returning();
};

export const updateStudentByRollNo = async (rollNo: string, data: any) => {
  return await db
    .update(studentModel)
    .set(data)
    .where(eq(studentModel.rollNo, rollNo))
    .returning();
};

export const findStudentByUserId = async (userId: number) => {
  return await db
    .select()
    .from(studentModel)
    .where(eq(studentModel.user_id, userId));
}
