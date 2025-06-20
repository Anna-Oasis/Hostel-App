import { eq, and, desc } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { attendanceModel, NewAttendance } from "../models/attendance";

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

  if (existingAttendance.length > 0) {
    const result = await db
      .update(attendanceModel)
      .set({
        no_present: attendanceData.no_present,
        no_absent: attendanceData.no_absent,
        absentee: attendanceData.absentee,
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

export const fetchAllAttendance = async () => {
  const result = await db
    .select()
    .from(attendanceModel)
    .orderBy(desc(attendanceModel.date), attendanceModel.hostel, attendanceModel.floor);
  
  return result;
};