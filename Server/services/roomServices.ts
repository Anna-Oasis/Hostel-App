import { eq, and, inArray } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { roomModel } from "../models/roomModel";
import { studentModel } from "../models/studentModel";

export const checkRoom= async (
  roomNumber: number, 
  hostelBlock: string, 
  academicYear: string
) => {
  const room = await db
    .select()
    .from(roomModel)
    .where(
      and(
        eq(roomModel.roomNumber, roomNumber),
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    )
    .limit(1);
    
  return room[0];
};

export const getStudentsofRoom= async (
  roomNumber: number, 
  hostelBlock: string, 
  academicYear: string
) => {
  const room = await db
    .select({ rollNo: roomModel.rollNo })
    .from(roomModel)
    .where(
      and(
        eq(roomModel.roomNumber, roomNumber),
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    );
    
  return room;
};

export const setStudentinRoom = async (
  rollNo: string[],
  roomNumber: number,
  hostelBlock: string,
  academicYear: string,
) => {
  
  return await db
    .update(roomModel)
    .set({ rollNo })
    .where(
      and(
        eq(roomModel.roomNumber, roomNumber),
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    )
    .returning();
};

export const updateStudentRoomNumber = async (
  rollNo: string, 
  roomNumber: number | null
) => {
  return await db
    .update(studentModel)
    .set({ roomNumber })
    .where(eq(studentModel.rollNo, rollNo))
    .returning();
};

export const updateStudentHostelDetails = async (
  rollNo: string, 
  roomNumber: number | null,
  floor:  number | null,
  hostelBlock: string| null,
) => {
  return await db
    .update(studentModel)
    .set({ roomNumber, floor, hostelBlock})
    .where(eq(studentModel.rollNo, rollNo))
    .returning();
};

export const fetchRoomDetailsByBlockAndAcademicYear= async (
  hostelBlock: string, 
  academicYear: string
) => {
  const room = await db
    .select()
    .from(roomModel)
    .where(
      and(
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    );
  
  // Room Details with Student Details
  /*
  const room = await db
    .select()
    .from(roomModel)
    .innerJoin(studentModel, inArray(studentModel.rollNo, roomModel.rollNo))
    .where(
      and(
        eq(roomModel.hostelBlock, hostelBlock),
        eq(roomModel.academicYear, academicYear)
      )
    );
  */
  
  return room;
};