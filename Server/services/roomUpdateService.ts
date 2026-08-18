import { and, eq, sql } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { roomModel } from "../models/roomModel";
import { studentModel } from "../models/studentModel";

export const changeRoom = async (
  fromHostelBlock: string,
  toHostelBlock: string,
  academicYear: string,
  fromRoomNo: number,
  toRoomNo: number,
  rollNo: string
) => {
  return await db.transaction(async (tx) => {

    // 1. Find the student in the source room
    const [sourceRoom] = await tx
      .select()
      .from(roomModel)
      .where(
        and(
          eq(roomModel.hostelBlock, fromHostelBlock as any),
          eq(roomModel.academicYear, academicYear),
          eq(roomModel.roomNumber, fromRoomNo),
          sql`${rollNo} = ANY(${roomModel.rollNo})`
        )
      );

    if (!sourceRoom) {
      return {
        success: false,
        message: "Roll number not found in the source room",
      };
    }

    // 2. Find the destination room
    const [destinationRoom] = await tx
      .select({
        floor: roomModel.floor,
        rollNo: roomModel.rollNo,
      })
      .from(roomModel)
      .where(
        and(
          eq(roomModel.hostelBlock, toHostelBlock as any),
          eq(roomModel.academicYear, academicYear),
          eq(roomModel.roomNumber, toRoomNo)
        )
      );

    if (!destinationRoom) {
      return {
        success: false,
        message: "Destination room not found",
      };
    }

    // 3. Check if student is already in destination room
    if (destinationRoom.rollNo?.includes(rollNo)) {
      return {
        success: false,
        message: "Student is already in the destination room",
      };
    }

    // 4. Remove student from source room
    await tx
      .update(roomModel)
      .set({
        rollNo: sql`
          array_remove(
            ${roomModel.rollNo},
            ${rollNo}
          )
        `,
      })
      .where(
        and(
          eq(roomModel.hostelBlock, fromHostelBlock as any),
          eq(roomModel.academicYear, academicYear),
          eq(roomModel.roomNumber, fromRoomNo)
        )
      );

    // 5. Add student to destination room
    await tx
      .update(roomModel)
      .set({
        rollNo: sql`
          array_append(
            COALESCE(${roomModel.rollNo}, ARRAY[]::varchar[]),
            ${rollNo}
          )
        `,
      })
      .where(
        and(
          eq(roomModel.hostelBlock, toHostelBlock as any),
          eq(roomModel.academicYear, academicYear),
          eq(roomModel.roomNumber, toRoomNo)
        )
      );

    // 6. Update student's room + block + floor
    await tx
      .update(studentModel)
      .set({
        hostelBlock: toHostelBlock as any,
        roomNumber: toRoomNo,
        floor: destinationRoom.floor,
      })
      .where(
        eq(studentModel.rollNo, rollNo)
      );

    return {
      success: true,
      message: "Room changed successfully",
    };
  });
};