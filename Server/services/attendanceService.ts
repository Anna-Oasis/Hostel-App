import { eq, and, desc, inArray } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { attendanceModel, NewAttendance } from "../models/attendance";
import { studentModel } from "../models/studentModel";

export const getAttendanceByRc = async (rc_id: number) => {
  const result = await db
    .select()
    .from(attendanceModel)
    .where(eq(attendanceModel.rc_id, rc_id))
    .orderBy(desc(attendanceModel.date));
  
  return result;
};

export const createAttendanceByRc = async (attendanceData: NewAttendance) => {
  const existingAttendance = await db
    .select()
    .from(attendanceModel)
    .where(
      and(
        eq(attendanceModel.rc_id, attendanceData.rc_id),
        eq(attendanceModel.date, attendanceData.date),
        eq(attendanceModel.hostel, attendanceData.hostel),
        eq(attendanceModel.floor, attendanceData.floor)
      )
    );
    console.log("Att ser ", attendanceData)
  if (existingAttendance.length > 0) {
    const result = await db
      .update(attendanceModel)
      .set({
        no_present: attendanceData.no_present,
        no_absent: attendanceData.no_absent,
        absentee: attendanceData.absentee,
        no_leave : attendanceData.no_leave,
        onleave : attendanceData.onleave,
        updated_at: new Date(),
      })
      .where(eq(attendanceModel.id, existingAttendance[0].id))
      .returning();
    
    return result;
  } else {
    const result = await db
      .insert(attendanceModel)
      .values(attendanceData)
      .returning();
    
    return result;
  }
};

export const fetchAllAttendance = async (block : string) => {
  const result = await db
    .select()
    .from(attendanceModel)
    .where(eq(attendanceModel.hostel, block))
    .orderBy(desc(attendanceModel.date), attendanceModel.hostel, attendanceModel.floor);
  
  return result;
};

export const fetchAllAttendanceByDate = async (date:string, block : string, floor : number) => {
  const attendance = await db
    .select()
    .from(attendanceModel)
    .where(and(
      eq(attendanceModel.date, date),
      eq(attendanceModel.hostel, block),
      eq(attendanceModel.floor, floor)
    ))
    .orderBy(desc(attendanceModel.date), attendanceModel.hostel, attendanceModel.floor);
  
  const rollNumbers =[...new Set(
      attendance.flatMap((record) => [
        ...record.absentee,
        ...record.onleave
      ])
    )
  ]
  if (rollNumbers.length === 0){
    return attendance.map((record) => ({
      ...record,
      absentee_details: [],
      onleave_details: [],
    }));
  }

  const students = await db
    .select({
      rollNo: studentModel.rollNo,
      name: studentModel.name,
      roomNumber: studentModel.roomNumber,
      mobile: studentModel.mobile,
    })
    .from(studentModel)
    .where(inArray(studentModel.rollNo, rollNumbers));

  const studentMap = new Map(
    students.map((student) => [student.rollNo, student])
  );
  
  return attendance.map((record) => ({
    ...record,

    absentee_details: record.absentee
      .map((rollNo) => studentMap.get(rollNo))
      .filter((student) => student !== undefined),

    onleave_details: record.onleave
      .map((rollNo) => studentMap.get(rollNo))
      .filter((student) => student !== undefined),
  }));
};