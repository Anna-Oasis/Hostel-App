import { NewRCLeave } from "../models/rcLeave";
import { db } from "../config/dbConnection";
import { eq, and } from "drizzle-orm";
import { rcLeaveModel } from "../models/rcLeave";
import { rcLeaveApprovalStatus } from "../constants/enum";
import { rcModel } from "../models/rcModel";

export const getRCLeaveApprovals = async (rcId: number) => {
    return await db
        .select({
            Id: rcLeaveModel.id,
            rcId: rcLeaveModel.rc_id,
            leaving: rcLeaveModel.leaving,
            arrival: rcLeaveModel.arrival,
            reason: rcLeaveModel.reason,
            approved: rcLeaveModel.approved,
            createdAt: rcLeaveModel.created_at,
            dwApprovedAt: rcLeaveModel.dw_approved_at,
            ewUpdatedAt: rcLeaveModel.ew_updated_at,
        })
        .from(rcLeaveModel)
        .where(eq(rcLeaveModel.rc_id, rcId));
};

export const createRcLeaveForm = async( data:NewRCLeave)=> {

    return await db.insert(rcLeaveModel).values(data).returning();
}

/**
 * 
 * @param rcId Id of the RC who is going on Leave
 * @param id Id of the AlterNate RC 
 * @returns 
 */
export async function updateAlternateRCtoId(rcId : number,id : number) {
  const updateRC = await db.update(rcModel)
      .set({
        alternatingToRCId : rcId
      })
      .where(eq(rcModel.userId, id))
      .returning();
  return updateRC;
}

/**
 * 
 * @param rcId Id of the RC who went on the Leave
 * @returns rcModel[] 
 */
export async function updateAlternateRCtoNull(rcId : number) {
  const updatedRC = await db.update(rcModel)
      .set({
        alternatingToRCId : null
      })
      .where(eq(rcModel.alternatingToRCId, rcId))
      .returning();
  return updatedRC;
}

export async function updateRCLeaveStatus(leaveId : number, status : string) {
    const updatedLeave = await db.update(rcLeaveModel)
        .set({
            approved : status
        })
        .where(eq(rcLeaveModel.id, leaveId))
        .returning();
    return updatedLeave;
}

export const getRCLeaveToBeApprovedByDeputyWarden = async () => {
  const leave_form = await db
    .select()
    .from(rcLeaveModel)
    .where(
    and(
        eq(rcLeaveModel.approved, rcLeaveApprovalStatus.SUBMITTED)
    ))
    .orderBy(rcLeaveModel.created_at);
  return leave_form;
};

export const getRCLeaveToBeApprovedByExecutiveWarden = async () => {
  const leave_form = await db
    .select()
    .from(rcLeaveModel)
    .where(
    and(
        eq(rcLeaveModel.approved, rcLeaveApprovalStatus.DEPUTYWARDEN)
    ))
    .orderBy(rcLeaveModel.created_at);
  return leave_form;
};