import { and, eq, inArray } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { studentModel } from "../models/studentModel";

export const fetchStudentDetailsForRC = async (
  floor: number[],
  hostelBlock: string
) => {
  const students = await db
    .select({
      rollNo: studentModel.rollNo,
      name: studentModel.name,
      roomNumber: studentModel.roomNumber,
      floor: studentModel.floor,
      hostelBlock: studentModel.hostelBlock,
    })
    .from(studentModel)
    .where(
      and(
        eq(studentModel.hostelBlock, hostelBlock),
        inArray(studentModel.floor, floor)
      )
    );

  return students;
};