import { and, eq, inArray, isNull, or, sql, lte, gte } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { studentModel } from "../models/studentModel";
import { leaveFormModel } from "../models/leaveForm";
import { studentLeaveApprovalStatus } from "../constants/enum";

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
    .where(eq(studentModel.approve, false))
    .orderBy(studentModel.createdAt);
}

export const fetchStudents = async () => {
  return await db
    .select()
    .from(studentModel)
    .orderBy(studentModel.createdAt);
}

export const fetchStudentsByBlock = async (block : string) => {
  return await db
    .select()
    .from(studentModel)
    .where(eq(studentModel.hostelBlock, block))
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


export const fetchStudentDetailsForAttendanceByRC = async (
  floor: number[],
  hostelBlock: string,
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

      hasLeave: sql<number>`
        CASE
          WHEN ${leaveFormModel.id} IS NOT NULL THEN 1
          ELSE 0
        END
      `,
    })
    .from(studentModel)
    .leftJoin(
      leaveFormModel,
      and(
        eq(studentModel.rollNo, leaveFormModel.roll_number),
        or(
          eq(leaveFormModel.status, studentLeaveApprovalStatus.RC),
          eq(
            leaveFormModel.status,
            studentLeaveApprovalStatus.DEPUTYWARDEN,
          ),
        ),
        lte(leaveFormModel.from_date, sql`CURRENT_DATE`),
        gte(leaveFormModel.to_date, sql`CURRENT_DATE`),
      ),
    )
    .where(
      and(
        eq(studentModel.hostelBlock, hostelBlock),
        inArray(studentModel.floor, floor),
      ),
    )
    .orderBy(studentModel.roomNumber);

  return students;
};