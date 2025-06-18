import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { approval_status } from "../constants/enum";
import { vacatingHostelModel, NewVacatingHostel } from "../models/vacatingHostel";
import { vacatingHostelApprovalsModel } from "../models/vacatingHostelApprovals";

export const createVacatingHostelForm = async (formData: NewVacatingHostel) => {
  return await db.insert(vacatingHostelModel).values(formData).returning();
};

export const getAllVacatingHostelForms = async () => {
  return await db.select().from(vacatingHostelModel);
};


export const getPendingRCApprovals = async (rcId: number) => {
  return await db
    .select()
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, approval_status.manager))
    // .where(eq(vacatingHostelModel.rc_id, rcId));  //No particular field for RC ID in the model, ONLY if the rcID is present we can fetch the pending requests
                                                     //of that particular RC
};

export const approveOrDeclineByRC = async (
  vacating_hostel_id: number,
  rcId: number,
  approve: boolean
) => {
  await db.insert(vacatingHostelApprovalsModel).values({
    vacating_hostel_id,
    user_id: rcId,
    approve,
  });

  const newStatus = approve ? approval_status.rc : approval_status.declined;
  await db
    .update(vacatingHostelModel)
    .set({ status: newStatus })
    .where(eq(vacatingHostelModel.id, vacating_hostel_id));

  return { message: approve ? "Approved by RC" : "Declined by RC" };
};

export const getVacatingFormsApprovedByRC = async () => {
  return await db
    .select()
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, approval_status.rc));
};

export const getVacatingFormsApprovedByManager = async () => {
  return await db
    .select()
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, approval_status.manager));
};