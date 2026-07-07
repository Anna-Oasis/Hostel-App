import { db } from "../config/dbConnection";
import { eq } from "drizzle-orm";
import {
  deputyWardenModel,
  NewDeputyWarden,
  DeputyWardenUpdate
} from "../models/deputyWarden";

export const createDeputyWardenService = async (
  data: NewDeputyWarden
) => {
  return await db
    .insert(deputyWardenModel)
    .values(data)
    .returning();
};

export const updateDeputyWardenService = async (
  data: DeputyWardenUpdate
) => {
  const { userId, ...updateData } = data;
  return await db
    .update(deputyWardenModel)
    .set(updateData)
    .where(eq(deputyWardenModel.userId, userId))
    .returning();
};

export const getDeputyWardenBlockByUserId = async (
  userId: number
) => {
  const [deputyWarden] = await db
    .select({
      block: deputyWardenModel.block,
    })
    .from(deputyWardenModel)
    .where(eq(deputyWardenModel.userId, userId));

  return deputyWarden.block;
};

export const getDeputyWardenDetails = async (
  userId: number
) => {
  const [deputyWarden] = await db
    .select()
    .from(deputyWardenModel)
    .where(eq(deputyWardenModel.userId, userId));

  return deputyWarden;
};