import { and, eq, inArray, isNull } from "drizzle-orm";
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

export const fetchStudentsForManagerVerification = async () => {
  return await db
    .select()
    .from(studentModel)
    .where(isNull(studentModel.approve))
    .orderBy(studentModel.createdAt);
}

export const fetchStudentDetailsForRC = async (
  floor: number[],
  hostelBlock: string
) => {
  const students = await db
    .select({
      rollNo: studentModel.rollNo,
      name: studentModel.name,
      roomNumber: studentModel.roomNumber,
      course: studentModel.course,
      branch: studentModel.branch,
      semester: studentModel.semester,
      mobile: studentModel.mobile,
      email: studentModel.email,
      emergencycontact: studentModel.emergencyContact,
      floor: studentModel.floor,
      hostelBlock: studentModel.hostelBlock,
    })
    .from(studentModel)
    .where(
      and(
        eq(studentModel.hostelBlock, hostelBlock),
        inArray(studentModel.floor, floor)
      )
    )
    .orderBy(studentModel.roomNumber);

  return students;
};