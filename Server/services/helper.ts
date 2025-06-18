import { rcModel } from "../models/rcModel";
import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";

export async function getRCidfromUserId(userId: number) {
  const queryRes = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.userId, userId))
    .limit(1);

  return queryRes[0].id;
}
