import { and, eq, sql } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { roomModel } from "../models/roomModel";
import { studentModel } from "../models/studentModel";

export const changeRoom = async (
  hostelBlock: string,
  academicYear: string,
  fromRoomNo: number,
  toRoomNo: number,
  rollNo: string
) => {
  return await db.transaction(async (tx) => {
    // Check if the roll number exists in the source room
    const [room] = await tx
        .select()
        .from(roomModel)
        .where(
            and(
            eq(roomModel.hostelBlock, hostelBlock as any),
            eq(roomModel.academicYear, academicYear),
            eq(roomModel.roomNumber, fromRoomNo),
            sql`${rollNo} = ANY(${roomModel.rollNo})`
            )
        );

        if (!room) {
        return {
            success: false,
            message: "Roll number not found in the source room",
        };
    }

      const [destinationRoom] = await tx
        .select({
          floor: roomModel.floor,
        })
        .from(roomModel)
        .where(
          and(
            eq(roomModel.hostelBlock, hostelBlock as any),
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

    // Remove the student from the old room
    await tx
      .update(roomModel)
      .set({
        rollNo: sql`array_remove(${roomModel.rollNo}, ${rollNo})`,
      })
      .where(
        and(
          eq(roomModel.hostelBlock, hostelBlock as any),
          eq(roomModel.academicYear, academicYear),
          eq(roomModel.roomNumber, fromRoomNo)
        )
      );

    // Add the student to the new room
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
          eq(roomModel.hostelBlock, hostelBlock as any),
          eq(roomModel.academicYear, academicYear),
          eq(roomModel.roomNumber, toRoomNo)
        )
      );
    
      await db
        .update(studentModel)
        .set({ roomNumber : toRoomNo , floor : destinationRoom.floor})
        .where(eq(studentModel.rollNo, rollNo))
        .returning();

    return {
      success: true,
      message: "Room changed successfully",
    };
  });
};