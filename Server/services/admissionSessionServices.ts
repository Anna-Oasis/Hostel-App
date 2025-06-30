import { db } from "../config/dbConnection";
import { admissionSessionModel } from "../models/admissionSession";
import { CreateAdmissionSessionInput } from "../validation/admissionSession.schema";
import { eq, and, sql } from "drizzle-orm";

export async function createAdmissionSessionService(
  data: CreateAdmissionSessionInput
) {
  return await db
    .insert(admissionSessionModel)
    .values({
      from: data.from,
      to: data.to,
      semesters: data.semesters,
      academic_year: data.academic_year,
    })
    .returning();
}

export async function getAdmissionSessionsService() {
  return await db.select().from(admissionSessionModel);
}

export async function updateAdmissionSessionService(
  id: number,
  data: CreateAdmissionSessionInput
) {
  return await db
    .update(admissionSessionModel)
    .set({
      from: data.from,
      to: data.to,
      semesters: data.semesters,
      academic_year: data.academic_year,
    })
    .where(eq(admissionSessionModel.id, id))
    .returning();
}

export async function getLatestAdmissionSessionForSemesterService(semester: number) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const sessions = await db
    .select()
    .from(admissionSessionModel)
    .where(
      and(
        sql`${semester} = ANY(${admissionSessionModel.semesters})`,
        sql`${admissionSessionModel.from} <= ${today}`,
        sql`${admissionSessionModel.to} >= ${today}`
      )
    )
    .orderBy(sql`${admissionSessionModel.from} DESC`)
    .limit(1);

  return sessions.length > 0 ? sessions[0] : null;
}
