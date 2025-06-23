import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";

import { rcModel } from "../models/rcModel";
import { approval_status } from "../constants/enum";
import { roomModel } from "../models/roomModel";
import {summerVacationModel } from "../models/summerVacation";

export async function createRC(
  name: string,
  userId: number,
  hostel: string,
) {
  const rc = await db
    .insert(rcModel)
    .values({
      name: name,
      userId: userId,
      hostel: hostel,
      onLeave: false,
      floor: [],
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning();
  return rc;
}

export async function getAllRCs() {
  const rc = await db
    .select()
    .from(rcModel);
  return rc;
}

export async function deleteRC(rc_id : number) {
  const deletedRC = await db
    .delete(rcModel)
    .where(eq(rcModel.id, rc_id))
    .returning();
  return deletedRC;
}

export async function updateRC(
  rc_id: number,
  name: string,
  hostel: string,
  floor: number[],
) {
  const updatedRC = await db
    .update(rcModel)
    .set({
      name: name,
      hostel: hostel,
      floor: floor,
      updatedAt: new Date()
    })
    .where(eq(rcModel.id, rc_id))
    .returning();
  return updatedRC;
}



export async function getRCById(rc_id: number) {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.id, rc_id))
    .limit(1);
  return rc;
}


export async function getRCByUserId(userId: number) {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.userId, userId))
    .limit(1);
  return rc;
}