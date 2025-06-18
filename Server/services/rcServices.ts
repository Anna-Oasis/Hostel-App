import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";

import { rcModel } from "../models/rcModel";

export async function getRCById(rc_id: number) {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.id, rc_id))
    .limit(1);
  return rc;
}
